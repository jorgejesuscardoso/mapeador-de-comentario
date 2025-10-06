import db from "../db";
import express, { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuid } from 'uuid'
import { GetCommand, ScanCommand, PutCommand, UpdateCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const chaptersLunar = express.Router();
const tableName = 'booksLunar';
const tableChapterName = 'chaptersBookLunar2'

// configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// multer config (memória, sem salvar localmente)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Função helper pra enviar imagem otimizada pro Cloudinary
async function uploadImage(buffer: Buffer, fileName: string) {
  const optimizedBuffer = await sharp(buffer)
    .resize({ width: 800 })
    .webp({ quality: 85 })
    .toBuffer();

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'projeto-lunar', public_id: fileName, resource_type: 'image' },
      (err, result) => {
        if (err) return reject(err);
        if (!result?.secure_url) return reject(new Error('No URL returned'));
        resolve(result.secure_url);
      }
    );
    stream.end(optimizedBuffer);
  });
}

//create
chaptersLunar.get('/create/:bookId', async (req: Request, res: Response) => {
  try {    
    const randomId = Date.now().toString(36)
    const { bookId } = req.params;
    const { title, paragraphs, wordsCount } = req.body;

    // 1. Buscar o livro
    const bookResult = await db.send(
      new GetCommand({
        TableName: tableName,
        Key: { id: bookId.trim() }
      })
    );

    if(!bookResult) {
      return res.status(400).json({ error: 'Livro não encontrado!' })
    }

    const id = randomId;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newChapter = {
      bookId: bookId.trim(),
      id,
      title: 'Capítulo sem nome',
      paragraphs: '',
      wordsCount: wordsCount,
      comments: [],
      votes: 0,
      views: 0,
      createdAt,
      updatedAt
    };

    await db.send(
      new PutCommand({
        TableName: tableChapterName,
        Item: newChapter
      })
    );

    res.status(201).json(id);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar capítulo' });
  }
});

//get por id
chaptersLunar.get('/:bookId/:chapterId', async (req: Request, res: Response) => {
  try {
    const { bookId, chapterId } = req.params;

    if (!bookId || !chapterId) {
      return res.status(400).json({ error: 'bookId e chapterId são obrigatórios!' });
    }

    // 1. Buscar o livro
    const bookResult = await db.send(
      new GetCommand({
        TableName: tableName,
        Key: { id: bookId.trim() }
      })
    );

    if(!bookResult) {
      return res.status(400).json({ error: 'Livro não encontrado!' })
    }

    const result = await db.send(
      new GetCommand({
        TableName: tableChapterName,
        Key: {
          bookId: bookId.trim(),
          id: chapterId.trim()
        }
      })
    );

    if (!result.Item) {
      return res.status(404).json({ error: 'Capítulo não encontrado' });
    }
    const data = {
      ...result.Item,
      cover: bookResult?.Item?.cover,
      bookName: bookResult?.Item?.name
    }


    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar capítulo' });
  }
});

//get pelo title
chaptersLunar.get('/chapter/title/:title', async (req: Request, res: Response) => {
  try {
    const { title } = req.params;

    if (!title) {
      return res.status(400).json({ error: 'O título é obrigatório!' });
    }

    const result = await db.send(
      new QueryCommand({
        TableName: tableChapterName,
        IndexName: "title-index", // GSI configurado no Dynamo
        KeyConditionExpression: "title = :title",
        FilterExpression: "attribute_not_exists(isDeleted) OR isDeleted = :false",
        ExpressionAttributeValues: {
          ":title": title,
          ":false": false
        }
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ error: 'Nenhum capítulo encontrado com esse título' });
    }

    res.status(200).json(result.Items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar capítulo pelo título' });
  }
});

chaptersLunar.patch('/:bookId/:chapterId', async (req: Request, res: Response) => {
  try {
    const { bookId, chapterId } = req.params;
    const { body } = req.body; // pode conter title, paragraphs etc.
   
    console.log(body)
    if (!bookId || !chapterId) {
      return res.status(400).json({ error: 'bookId e chapterId são obrigatórios!' });
    }

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo enviado para atualização!' });
    }

    // montar dinamicamente UpdateExpression
    let updateExp = "SET updatedAt = :updatedAt";
    const expValues: any = { ":updatedAt": new Date().toISOString() };

    Object.keys(body).forEach((key, idx) => {
      updateExp += `, ${key} = :val${idx}`;
      expValues[`:val${idx}`] = body[key];
    });

    const id = chapterId;
    const result = await db.send(
      new UpdateCommand({
        TableName: tableChapterName,
        Key: { bookId, id },
        UpdateExpression: updateExp,
        ExpressionAttributeValues: expValues,
        ReturnValues: "ALL_NEW"
      })
    );

    res.status(200).json(result.Attributes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar capítulo' });
  }
});

chaptersLunar.delete('/:bookId/:chapterId', async (req: Request, res: Response) => {
  try {
    const { bookId, chapterId } = req.params;

    if (!bookId || !chapterId) {
      return res.status(400).json({ error: 'bookId e chapterId são obrigatórios!' });
    }

    const result = await db.send(
      new DeleteCommand({
        TableName: tableChapterName,
        Key: { bookId, id: chapterId }
      })
    );

    res.status(200).json({ message: "Capítulo deletado com sucesso", item: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar capítulo' });
  }
});



export default chaptersLunar;
