// user.ts
import db from "../db";
import express, { Request, Response } from 'express';
import { GetCommand, ScanCommand, PutCommand, UpdateCommand  } from '@aws-sdk/lib-dynamodb';
import { generateToken, verifyToken } from "../configs/jwt";

const books = express.Router();



books.post('/register', async (req: Request, res: Response) => {
  const { user, bookUrl, bookName } = req.body;

  if (!user || !bookUrl || !bookName) {
    return res.status(400).json({ error: 'Dados ausente!' });
  }

  const urlObj = new URL(bookUrl);
  const pathParts = urlObj.pathname.split('/');
  const id = pathParts[2]?.split('-')[0]; // Captura o ID mesmo se vier seguido de texto (ex: 389938474-nome-do-livro)

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'ID inválido na URL!' });
  }

  try {
    // Verifica se já existe
    const existing = await db.send(
      new GetCommand({
        TableName: 'books',
        Key: { book_id: id }
      })
    );

    if (existing.Item) {
      return res.status(200).json({ error: 'Livro já registrado!' });
    }

    const existingUser = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { user: user }
      })
    );

    if (!existingUser.Item) {
      return res.status(200).json({ error: 'Usuário não encontrado!' });
    }

    await db.send(
      new PutCommand({
        TableName: 'books',
        Item: {
          user,
          book_id: id,
          book_name: bookName,
          createdAt: new Date().toISOString()
        }
      })
    );

    await db.send(
      new UpdateCommand({
        TableName: 'dbLunar2',
        Key: { user },
        UpdateExpression: 'SET books = list_append(if_not_exists(books, :empty_list), :newBook)',
        ExpressionAttributeValues: {
          ':newBook': [{
            author: user,
            book_id: id,
            book_name: bookName,
            createdAt: new Date().toISOString()
          }],
          ':empty_list': []
        }
      })
    );

    res.status(201).json({ message: 'Livro cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ error: 'Erro ao registrar o livro!' });
  }
});

books.post('/feed', async (req: Request, res: Response) => {
  const { user, bookUrl, bookName, key } = req.body;

  if(key) return res.status(401).json({ error: 'Acesso nengado!'})

  if (!user || !bookUrl || !bookName) {
    return res.status(400).json({ error: 'Dados ausente!' });
  }
  console.log('registrando o livro: ', bookName)
  try {
    // Verifica se já existe
    const existing = await db.send(
      new GetCommand({
        TableName: 'books',
        Key: { book_id: bookUrl }
      })
    );

    if (existing.Item) {
      return res.status(200).json({ error: 'Livro já registrado!' });
    }

    await db.send(
      new PutCommand({
        TableName: 'books',
        Item: {
          user,
          book_id: bookUrl,
          book_name: bookName,
          createdAt: new Date().toISOString()
        }
      })
    );

    res.status(201).json({ message: 'Livro cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ error: 'Erro ao registrar o livro!' });
  }
});

books.get('/', async (req: Request, res: Response) => {
  try {
    const result = await db.send(
      new ScanCommand({
        TableName: 'books'
      })
    );

    const data = [] as any[]

    if (result.Items && result.Items.length > 0) {
        result.Items.map((s: any) => {
          if (!s.deletedAt) {
            data.push(s)
          }
        })
    }

    res.status(200).json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao acessar o DynamoDB' });
  }
});

books.get('/:book', async (req: Request, res: Response) => {
  const { bookId: bookParam } = req.params;
  
  try {
    const result = await db.send(
      new GetCommand({
        TableName: 'books',
        Key: { book_id: bookParam }
      })
    );

    if (!result.Item || result.Item.deletedAt) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }

    res.json(result.Item);
  } catch (err) {
    console.error('Erro ao buscar Livro:', err);
    res.status(500).json({ error: 'Erro ao buscar Livro!' });
  }
});

books.put('/:book', async (req: Request, res: Response) => {
  const bookParam = req.params.user;
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'Dados ausentes!' });
  }

  try {
    // Pega o usuário pelo valor da URL (chave primária)
    const result = await db.send(
      new GetCommand({
        TableName: 'books',
        Key: { book_id: bookParam }
      })
    );

    if (!result.Item || result.Item.deletedAt) {
      return res.status(404).json({ error: 'Livro não encontrado!' });
    }

    // Atualiza o mesmo item sem mudar a chave
    await db.send(
      new PutCommand({
        TableName: 'books',
        Item: {
          book_name: data.bookName || result.Item.book_name,
          book_id: bookParam, // Usa sempre a chave original
          updatedAt: new Date().toISOString()
        }
      })
    );

    res.json({ message: 'Livro atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar Livro:', err);
    res.status(500).json({ error: 'Erro ao atualizar Livro!' });
  }
});

books.delete('/:book', async (req: Request, res: Response) => {
  const { book: bookParam } = req.params;

  try {
    const result = await db.send(
      new GetCommand({
        TableName: 'books',
        Key: { book_id: bookParam }
      })
    );

    if (!result.Item || result.Item.deletedAt) {
      return res.status(404).json({ error: 'Livro não encontrado!' });
    }

    await db.send(
      new PutCommand({
        TableName: 'books',
        Item: {
          ...result.Item,
          deletedAt: new Date().toISOString()
        }
      })
    );

    res.json({ message: 'Livro deletado (soft delete) com sucesso!' });
  } catch (err) {
    console.error('Erro ao deletar livro:', err);
    res.status(500).json({ error: 'Erro ao deletar livro!' });
  }
}); 


books.post('/feed', async (req: Request, res: Response) => {
  const { user, bookUrl, bookName } = req.body;

  if (!user || !bookUrl || !bookName) {
    return res.status(400).json({ error: 'Dados ausente!' });
  }

  const split = bookUrl.split('story/')[1]
  const splitId = split.split('-')[0]

  try {
    // Verifica se já existe
    const existing = await db.send(
      new GetCommand({
        TableName: 'books',
        Key: { book_id: splitId }
      })
    );

    if (existing.Item) {
      return res.status(200).json({ error: 'Livro já registrado!' });
    }

    await db.send(
      new PutCommand({
        TableName: 'books',
        Item: {
          user,
          book_id: splitId,
          book_name: bookName,
          createdAt: new Date().toISOString()
        }
      })
    );

    res.status(201).json({ message: 'Livro cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ error: 'Erro ao registrar o livro!' });
  }
});



export default books;
