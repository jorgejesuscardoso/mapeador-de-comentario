import db from "../db";
import express, { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuid } from 'uuid'
import { GetCommand, ScanCommand, PutCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const bookLunar = express.Router();
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

bookLunar.post('/create', upload.single('cover'), async (req: Request, res: Response) => {
  try {    
    const randomId = Date.now().toString(36)
    const file = (req as any).file;
    const data = req.body
    data.id = randomId
    let fileName = ''
    let url = 'https://res.cloudinary.com/dffkokd7l/image/upload/v1759525530/projeto-lunar/ChatGPT%20Image%203%20de%20out.%20de%202025%2C%2017_25_41-1759525529098.webp'
    
    if (file) {
      // Gera um nome único para o arquivo
      fileName = randomId;
      url = await uploadImage(file.buffer, fileName);
    }

    // Faz upload da imagem
    data.cover = url
    data.status = 'ongoing'
    // Atualiza cover no DynamoDB

    await db.send(new PutCommand({
      TableName: tableName,
      Item: {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }))
    
    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao enviar a capa' });
  }
});

bookLunar.patch('/update/:id', upload.single('cover'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params ;
    const data = req.body;
    const file = (req as any).file;

    if (!id) {
      return res.status(400).json({ error: 'Paramento id é obrigatório' });
    }

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo enviado para atualização' });
    }
    
    const hasBook = await await db.send(
      new GetCommand({
        TableName: tableName,
        Key: { id: id.trim() }
      })
    );

    if(!hasBook.Item) return res.status(400).json({ error: 'Nenhum livro encontrado!' });

    if (file) {
      // Gera um nome único para o arquivo      
      let fileName = ''
      fileName = Date.now().toString(36);
      const url = await uploadImage(file.buffer, fileName);
      data.cover = url
    }

    // Faz upload da imagem
    // Atualiza cover no DynamoDB
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    let i = 0;
    for (const [key, value] of Object.entries(data)) {
      i++;
      const attrName = `#attr${i}`;
      const attrValue = `:val${i}`;
      updateExpressions.push(`${attrName} = ${attrValue}`);
      expressionAttributeNames[attrName] = key;
      expressionAttributeValues[attrValue] = value;
    }

    // Sempre atualiza updatedAt
    updateExpressions.push(`#updatedAt = :updatedAt`);
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await db.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id: id.trim() },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      })
    );

    res.status(200).json({ message: 'Livro atualizado com sucesso', item: result.Attributes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar livro' });
  }
});

bookLunar.delete('/softdelete', async (req: Request, res: Response) => {
  try {
    const { id } = req.query as { id?: string };

    if (!id) {
      return res.status(400).json({ error: 'Query id e name são obrigatórios' });
    }

    const result = await db.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id: id.trim() },
        UpdateExpression: 'SET #deletedAt = :deletedAt, #isDeleted = :isDeleted',
        ExpressionAttributeNames: {
          '#deletedAt': 'deletedAt',
          '#isDeleted': 'isDeleted'
        },
        ExpressionAttributeValues: {
          ':deletedAt': new Date().toISOString(),
          ':isDeleted': true
        },
        ReturnValues: 'ALL_NEW'
      })
    );

    res.status(200).json({ message: 'Livro marcado como deletado', item: result.Attributes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar livro' });
  }
});

//get geral
bookLunar.get('/', async (req: Request, res: Response) => {
  try {
    const result = await db.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: 'attribute_not_exists(#isDeleted) OR #isDeleted = :false',
        ExpressionAttributeNames: { '#isDeleted': 'isDeleted' },
        ExpressionAttributeValues: { ':false': false }
      })
    );

    // Normalizar livros
    if(!result.Items) return res.status(200).json([]);
    const books = await Promise.all(
      result.Items.map(async (book: any) => {
        const bookId = book.id;

        // Buscar capítulos relacionados
        const chapters = await db.send(
          new QueryCommand({
            TableName: tableChapterName,
            KeyConditionExpression: 'bookId = :bookId',
            ExpressionAttributeValues: {
              ':bookId': bookId // se usar client bruto
              // ':bookId': bookId  // se usar DocumentClient (lib-dynamodb)
            }
          })
        );

        // Somar métricas
        let totalViews = 0;
        let totalVotes = 0;
        let totalComments = 0;

        chapters.Items?.forEach((chapter: any) => {
          totalViews += parseInt(chapter.views || 0, 10);
          totalVotes += parseInt(chapter.votes || 0, 10);
          totalComments += chapter.comments?.length || 0;
        });

        return {
          ...book,
          // métricas agregadas
          views: totalViews,
          votes: totalVotes,
          commentsTotal: totalComments
        };
      })
    );

    res.status(200).json(books || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar livros' });
  }
});

//get id
bookLunar.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'O id é obrigátorio!' });
    }

    // 1. Buscar o livro
    const bookResult = await db.send(
      new GetCommand({
        TableName: tableName,
        Key: { id: id.trim() }
      })
    );

    if (!bookResult.Item || bookResult.Item.isDeleted) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }

    // 2. Buscar capítulos do livro
    const chaptersResult = await db.send(
      new QueryCommand({
        TableName: tableChapterName,
        KeyConditionExpression: "bookId = :bookId",
        ExpressionAttributeValues: {
          ":bookId": id.trim()
        }
      })
    );

    // 3. Calcular métricas agregadas
    let totalViews = 0;
    let totalVotes = 0;
    let totalComments = 0;

    chaptersResult.Items?.forEach((chapter: any) => {
      totalViews += parseInt(chapter.views || 0, 10);
      totalVotes += parseInt(chapter.votes || 0, 10);
      totalComments += chapter.comments?.length || 0;
    });

    // 4. Montar resposta
    const response = {
      ...bookResult.Item,
      chapters: chaptersResult.Items || [],
      views: totalViews,
      votes: totalVotes,
      commentsTotal: totalComments
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar livro e capítulos' });
  }
});

//get name
bookLunar.get('/by-name/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;

    const result = await db.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: '#name = :name AND (attribute_not_exists(#isDeleted) OR #isDeleted = :false)',
        ExpressionAttributeNames: { '#name': 'name', '#isDeleted': 'isDeleted' },
        ExpressionAttributeValues: { ':name': name, ':false': false }
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }

    res.status(200).json(result.Items[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar por nome' });
  }
});

//get author
bookLunar.get('/user/:author', async (req: Request, res: Response) => {
  try {
    const { author } = req.params;

    const result = await db.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: 'author-index',
        KeyConditionExpression: '#author = :author',
        FilterExpression: 'attribute_not_exists(#isDeleted) OR #isDeleted = :false',
        ExpressionAttributeNames: { '#author': 'author', '#isDeleted': 'isDeleted' },
        ExpressionAttributeValues: { ':author': author, ':false': { BOOL: false } }
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return res.status(200).json({ msg: 'Você não possui obras publicadas!' });
    }

    // Normalizar livros
    const books = await Promise.all(
      result.Items.map(async (book: any) => {
        const bookId = book.id;

        // Buscar capítulos relacionados
        const chapters = await db.send(
          new QueryCommand({
            TableName: tableChapterName,
            KeyConditionExpression: 'bookId = :bookId',
            ExpressionAttributeValues: {
              ':bookId': bookId // se usar client bruto
              // ':bookId': bookId  // se usar DocumentClient (lib-dynamodb)
            }
          })
        );

        // Somar métricas
        let totalViews = 0;
        let totalVotes = 0;
        let totalComments = 0;

        chapters.Items?.forEach((chapter: any) => {
          totalViews += parseInt(chapter.views || 0, 10);
          totalVotes += parseInt(chapter.votes || 0, 10);
          totalComments += chapter.comments?.length || 0;
        });

        return {
          ...book,
          // métricas agregadas
          views: totalViews,
          votes: totalVotes,
          commentsTotal: totalComments
        };
      })
    );

    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar por autor' });
  }
});

// get genre
bookLunar.get('/by-genre/:genre', async (req: Request, res: Response) => {
  try {
    const { genre } = req.params;

    const result = await db.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: '#genre = :genre AND (attribute_not_exists(#isDeleted) OR #isDeleted = :false)',
        ExpressionAttributeNames: { '#genre': 'genre', '#isDeleted': 'isDeleted' },
        ExpressionAttributeValues: { ':genre': genre, ':false': false }
      })
    );

    res.status(200).json(result.Items || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar por gênero' });
  }
});



// Rota de upload de capa

bookLunar.post('/cover', upload.single('cover'), async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    const { id } = req.query as { id?: string; };

    if (!file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    if (!id) return res.status(400).json({ error: 'Query id é obrigatório' });

    // Gera um nome único para o arquivo
    const fileName = `${file.originalname.replace(/\.[^/.]+$/, '')}-${Date.now()}`;

    // Faz upload da imagem
    const url = await uploadImage(file.buffer, fileName);

    // Atualiza cover no DynamoDB
    await db.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          id: id.trim(),
        },
        UpdateExpression: 'SET cover = :cover, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':cover': url.trim(),
          ':updatedAt': new Date().toISOString()
        }
      })
    );

    res.status(200).json({ id, url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao enviar a capa' });
  }
});




export default bookLunar;
