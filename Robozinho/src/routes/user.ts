// house.ts
import db from "../db";
import express, { Request, Response } from 'express';
import { GetCommand, ScanCommand, PutCommand  } from '@aws-sdk/lib-dynamodb';
import { generateToken, verifyToken } from "../configs/jwt";
import { generateHash, verifyHash } from "../configs/bcrypt";
import axios from "axios";
import { parse } from 'php-array-parser';
import { calculateUserTierByPoints } from "../gamification/tiers";

const house = express.Router();

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



house.post('/register', async (req: Request, res: Response) => {
  const { house, password, name, age, role, subrole } = req.body;

  if (!house || !password) {
    return res.status(400).json({ error: 'Usuário ou senha ausente!' });
  }

  try {
    // Verifica se já existe
    const existing = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { house }
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
          house,
          password: hashedPassword,
          name,
          age,
          role,
          subrole,
          promo:[],
          tierPoints: 0,
          createdAt: new Date().toISOString(),
        }
      })
    );

    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ error: 'Erro ao registrar usuário!' });
  }
});

house.get('/', async (req: Request, res: Response) => {
  try {
    const result = await db.send(
      new ScanCommand({
        TableName: 'house',
      })
    )

    const data = result.Items

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao acessar o DynamoDB' });
  }
});


house.get('/wtpd/:id', async (req: Request, res: Response) => {
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

house.get('/:id', async (req: Request, res: Response) => {
  const { id: userParam } = req.params;
  
  try {
    const result = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { house: userParam }
      })
    );

    
    if (!result.Item || result.Item.deletedAt) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const tier = calculateUserTierByPoints(result.Item.tierPoints)

    let houseData = {}

    if (result.Item.house && result.Item.house.trim() !== '') {
      try {
        const houseResult = await db.send(
          new GetCommand({
            TableName: 'house',
            Key: { name: result.Item.house }
          })
        )
        houseData = houseResult.Item || ''
      } catch (err) {
        console.warn(`Erro ao buscar house "${result.Item.house}":`, err)
      }
    }

    result.Item.house = houseData
    const userData = { ...tier, ...result.Item}

    res.json(userData);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ error: 'Erro ao buscar usuário!' });
  }
});

house.put('/:house', async (req: Request, res: Response) => {
  const userParam = req.params.house;
  const { data } = req.body;
  
    
  if (!data) {
    return res.status(400).json({ error: 'Dados ausentes!' });
  }

  try {
    const result = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { house: userParam }
      })
    );
    
    const existingUser = result.Item;
    if (!existingUser || existingUser.deletedAt) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    // Atualiza senha se houver
    let updatedPassword = existingUser.password;
    if (data.password) {
      updatedPassword = await generateHash(data.password);
    }
    let currentTierPoints = result?.Item?.tierPoints 
    if(data.tierPointsPlus){
      currentTierPoints += data.tierPointsPlus
    } else if (data.tierPointsMinus) {
      if (data.tierPointsMinus > currentTierPoints) {
        currentTierPoints = 0;
      } else {
        currentTierPoints -= data.tierPointsMinus;
      }
    }

    let currentPoints = result?.Item?.points;
    
    if(data.pointsPlus){
      currentPoints += data.pointsPlus
    } else if (data.pointsMinus) {
      if (data.pointsMinus > currentPoints) {
        currentPoints = 0;
      } else {
        currentPoints -= data.pointsMinus;
      }
    }
    
    await db.send(
      new PutCommand({
        TableName: 'dbLunar2',
        Item: {
          ...existingUser, // mantém os campos que não foram modificados
          ...data,
          points: currentPoints,
          password: updatedPassword,
          role: data.role || existingUser.role,
          tierPoints: currentTierPoints,
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

house.put('/promo/:house', async (req: Request, res: Response) => {
  const userParam = req.params.house;
  const data = req.body;
  
  if (!data) {
    return res.status(400).json({ error: 'Dados ausentes!' });
  }

  try {
    const result = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { house: userParam }
      })
    );

    const existingUser = result.Item;
    if (!existingUser || existingUser.deletedAt) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    let currentTierPoints = (Number(result?.Item?.tierPoints) || 0) + (Number(data?.tierPointsPlus) || 0);

    

    await db.send(
      new PutCommand({
        TableName: 'dbLunar2',
        Item: {
          ...existingUser, // mantém os campos que não foram modificados
          tierPoints: currentTierPoints,
          updatedAt: new Date().toISOString(),
          promo: [data.promo]
        }
      })
    );

    res.json({ message: 'Usuário atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).json({ error: 'Erro ao atualizar usuário!' });
  }
});

house.delete('/:house', async (req: Request, res: Response) => {
  const { house: userParam } = req.params;

  try {
    const result = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { house: userParam }
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


export default house;
