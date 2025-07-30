// user.ts
import db from "../db";
import express, { Request, Response } from 'express';
import { GetCommand, ScanCommand, PutCommand, QueryCommand  } from '@aws-sdk/lib-dynamodb';
import { generateToken, verifyToken } from "../configs/jwt";
import { generateHash, verifyHash } from "../configs/bcrypt";
import axios from "axios";
import { parse } from 'php-array-parser';
import { calculateUserTierByPoints } from "../gamification/tiers";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' }); // ou tua região
const docClient = DynamoDBDocumentClient.from(client);

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
  const { user, password, name, age, role, subrole } = req.body;

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
          subrole,
          promo:[],
          tierPoints: 0,
          house: '',
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

user.post('/login', async (req: Request, res: Response) => {
  const { user, password } = req.body;
  if (!user || !password) {
    return res.status(400).json({ error: 'Dados ausentes!!' });
  }

  let account;

  try {
    // Tenta buscar direto pela chave primária
    const result = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { user },
      })
    );

    if (result.Item && !result.Item.deletedAt) {
      account = result.Item;
    }

     // Se não achou, procura pelo campo `username` usando o GSI
    if (!account) {
      const queryResult = await db.send(
        new QueryCommand({
          TableName: 'dbLunar2',
          IndexName: 'username-index', // esse é o nome do GSI
          KeyConditionExpression: 'username = :u',
          ExpressionAttributeValues: {
            ':u': String(user).trim(), // sem { S: ... }, pois o DocumentClient já trata
          },
          Limit: 1,
        })
      );

      if (queryResult.Items && queryResult.Items.length > 0) {
        account = queryResult.Items[0];
      }
    }

    // Se ainda assim não encontrou
    if (!account) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const validPass = await verifyHash(password, account.password);
    if (!validPass) {
      return res.status(401).json({ error: 'Dados inválidos!' });
    }

    const tier = calculateUserTierByPoints(account.tierPoints);
    const getToken = generateToken({ user: account.user, role: account.role });

    const userData = {
      ...tier,
      token: getToken.token,
      role: account.role,
      subrole: account.subrole,
      user: account.user,
      house: account.house,
      points: account.points,
    };

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

    let data = [] as any[];

    if (result.Items && result.Items.length > 0) {
      data = await Promise.all(
        result.Items
          .filter((s: any) => !s.deletedAt)
          .map(async ({ password, ...rest }) => {
          const tier = calculateUserTierByPoints(rest.tierPoints || 0);

          let wattpadData = null;

          try {
            const url = `https://www.wattpad.com/api/v3/users/${rest.user}`;
            const response = await axios.get(url, {
              headers: { Accept: 'text/plain' },
              responseType: 'text',
            });

            const parsed = parsePhpArray(response.data);

            if (!parsed?.username) {
              return null; // Wattpad inválido
            }

            // Só busca house se rest.house for válido
            let houseData: any = '';
            if (rest.house) {
              const houseResult = await db.send(
                new GetCommand({
                  TableName: 'house',
                  Key: { name: rest.house }
                })
              );
              houseData = houseResult.Item || '';
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

            return {
              ...formatted,
              ...rest,
              house: houseData,
              tier
            };
          } catch (err) {
            return {
              ...rest,
              username: rest.user,
              avatar: '',
              description: '',
              name: rest.name || '',
              house: '',
              tier
            };
          }
        })
      );
    }


    res.status(200).json(data); // já com tier embutido em cada user
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
    return res.status(200).json({ error: 'Erro ao buscar usuário!' });
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

user.put('/:user', async (req: Request, res: Response) => {
  const userParam = req.params.user;
  const { data } = req.body;
  
  if (!data) {
    return res.status(400).json({ error: 'Dados ausentes!' });
  }

  try {
    const result = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { user: userParam }
      })
    );
    
    const existingUser = result.Item;
    if (!existingUser || existingUser.deletedAt) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    // Atualiza senha se houver
    let updatedPassword = existingUser.password;
    if (data.newpassword) {
      updatedPassword = await generateHash(data.newpassword);
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
          username: data.username || existingUser.username,
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

user.put('/promo/:user', async (req: Request, res: Response) => {
  const userParam = req.params.user;
  const data = req.body;
  
  if (!data) {
    return res.status(400).json({ error: 'Dados ausentes!' });
  }

  try {
    const result = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { user: userParam }
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
