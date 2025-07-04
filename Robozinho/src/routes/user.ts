// user.ts
import db from "../db";
import express, { Request, Response } from 'express';
import { GetCommand, ScanCommand, PutCommand  } from '@aws-sdk/lib-dynamodb';
import { generateToken, verifyToken } from "../configs/jwt";
import { generateHash, verifyHash } from "../configs/bcrypt";

const user = express.Router();



user.post('/register', async (req: Request, res: Response) => {
  const { user, password, name, age } = req.body;

  if (!user || !password) {
    return res.status(400).json({ error: 'Usuário ou senha ausente!' });
  }

  try {
    // Verifica se já existe
    const existing = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { user }
      })
    );

    if (existing.Item) {
      return res.status(409).json({ error: 'Usuário já existe!' });
    }

    const hashedPassword = await generateHash(password);

    // ✅ Aqui está o segredo: usar `new PutCommand`
    await db.send(
      new PutCommand({
        TableName: 'dbLunar2',
        Item: {
          user,
          password: hashedPassword,
          name,
          age,
          createdAt: new Date().toISOString()
        }
      })
    );

    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ error: 'Erro ao registrar usuário!' });
  }
});

user.post('/login', async (req: Request, res: Response) => {
  const { user, password } = req.body;
  if (!user || !password) {
    return res.status(400).json({ error: 'Dados ausentes!!' });
  }

  try {
    const result = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { user }
      })
    );

    if (!result.Item || result.Item.deletedAt) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const validPass = await verifyHash(password, result.Item.password)
    
    if (!validPass) {
      return res.status(401).json({ error: 'Dados inválidos!' })
    };

    const getToken = generateToken({user: result.Item.user, role: result.Item.role})
    const userData = { token: getToken.token, role: result.Item.role, user: result.Item.user}
    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao acessar o DynamoDB' });
  }
});

user.get('/', async (req: Request, res: Response) => {
  try {
    const result = await db.send(
      new ScanCommand({
        TableName: 'dbLunar2'
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

user.get('/:user', async (req: Request, res: Response) => {
  const { user: userParam } = req.params;

  try {
    const result = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { user: userParam }
      })
    );

    if (!result.Item || result.Item.deletedAt) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(result.Item);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ error: 'Erro ao buscar usuário!' });
  }
});

user.put('/:user', async (req: Request, res: Response) => {
  const userParam = req.params.user;
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'Dados ausentes!' });
  }

  try {
    // Pega o usuário pelo valor da URL (chave primária)
    const result = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { user: userParam }
      })
    );

    if (!result.Item || result.Item.deletedAt) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    // Gera novo hash se a senha for atualizada
    let updatedPassword = result.Item.password;
    if (data.password) {
      updatedPassword = await generateHash(data.password);
    }

    // Atualiza o mesmo item sem mudar a chave
    await db.send(
      new PutCommand({
        TableName: 'dbLunar2',
        Item: {
          user: userParam, // Usa sempre a chave original
          password: updatedPassword,
          role: data.role || result.Item.role,
          updatedAt: new Date().toISOString()
        }
      })
    );

    res.json({ message: 'Usuário atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).json({ error: 'Erro ao atualizar usuário!' });
  }
});


user.delete('/:user', async (req: Request, res: Response) => {
  const { user: userParam } = req.params;

  try {
    const result = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { user: userParam }
      })
    );

    if (!result.Item || result.Item.deletedAt) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    await db.send(
      new PutCommand({
        TableName: 'dbLunar2',
        Item: {
          ...result.Item,
          deletedAt: new Date().toISOString()
        }
      })
    );

    res.json({ message: 'Usuário deletado (soft delete) com sucesso!' });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    res.status(500).json({ error: 'Erro ao deletar usuário!' });
  }
});


export default user;
