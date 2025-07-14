// user.ts
import db from "../db";
import express, { Request, Response } from 'express';
import { GetCommand, ScanCommand, PutCommand  } from '@aws-sdk/lib-dynamodb';
import { generateToken, verifyToken } from "../configs/jwt";
import { generateHash, verifyHash } from "../configs/bcrypt";
import axios from "axios";
import { parse } from 'php-array-parser';
import { calculateUserTierByPoints } from "../gamification/tiers";

const user = express.Router();

function parsePhpArray(str: string) {
  const result: Record<string, any> = {};
  const lines = str
    .replace(/^array\s*\(\s*/i, '')      // remove 'array ('
    .replace(/\)\s*$/, '')               // remove ')'
    .split(/\n(?=\s{2,}'[^']+')/)        // quebra apenas nas linhas de chave (mantém multilinhas no valor)
    .map(l => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const match = line.match(/^'(.+?)'\s*=>\s*(.+)$/s);
    if (!match) continue;
    let [, key, value] = match as any;

    // Remove vírgula no final se existir
    value = value.trim().replace(/,$/, '');

    // Trata strings com aspas
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1).replace(/\\'/g, "'");
    }

    // Trata números
    if (!isNaN(Number(value))) {
      value = Number(value);
    }

    // Trata booleanos e null
    if (value === 'false') value = false;
    if (value === 'true') value = true;
    if (value === 'NULL' || value === 'null') value = null;

    result[key] = value;
  }

  return result;
}



user.post('/register', async (req: Request, res: Response) => {
  const { user, password, name, age, role } = req.body;

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
      return res.status(200).json({ error: 'Usuário já existe!' });
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
          role,
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

    const tier = calculateUserTierByPoints(result.Item.tierPoints)
    const getToken = generateToken({user: result.Item.user, role: result.Item.role})
    const userData = { ...tier, token: getToken.token, role: result.Item.role, subrole: result.Item.subrole, user: result.Item.user, house: result.Item.house, points: result.Item.points}
    
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


user.get('/wtpd/:id', async (req: Request, res: Response) => {
  const { id: userParam } = req.params;
  const url = `https://www.wattpad.com/api/v3/users/${userParam}`;

  
  try {
    const response = await axios.get(url, {
      headers: { Accept: 'text/plain' },
      responseType: 'text',
    });

    const parsed = parsePhpArray(response.data);

    if (!parsed?.username) {
      return res.status(201).json({ message: 'Usuário não encontrado no Wattpad' });
    }
 
    const formatted = {
      username: parsed.username,
      avatar: parsed.avatar,
      description: parsed.description,
      gender: parsed.gender,
      name: parsed.name,
      createDate: parsed.createDate,
      modifyDate: parsed.modifyDate,
      numFollowers: parsed.numFollowers || 0,
      numFollowing: parsed.numFollowing || 0,
      numLists: parsed.numLists || 0,
      numStoriesPublished: parsed.numStoriesPublished || 0,
      votesReceived: parsed.votesReceived || 0,
      deeplink: parsed.deeplink,
    };

    return res.json(formatted);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return res.status(500).json({ error: 'Erro ao buscar usuário!' });
  }
});

user.get('/:id', async (req: Request, res: Response) => {
  const { id: userParam } = req.params;
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
