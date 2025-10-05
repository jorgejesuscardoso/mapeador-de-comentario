// house.ts
import db from "../db";
import express, { Request, Response } from 'express';
import { GetCommand, ScanCommand, PutCommand  } from '@aws-sdk/lib-dynamodb';
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

house.post('/', async (req: Request, res: Response) => {
  const { name, description, points, theme, tags } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'O campo "name" é obrigatório' });
  }

  try {
    // verifica se já existe
    const existing = await db.send(
      new GetCommand({
        TableName: 'house',
        Key: { name }
      })
    );

    if (existing.Item && !existing.Item.deletedAt) {
      return res.status(409).json({ error: 'Já existe uma casa com esse nome' });
    }

    const newHouse = {
      name,
      description: description || '',
      points: points || 0,
      theme: theme || '',
      tags: tags || [],
      createdAt: new Date().toISOString(),
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
    };

    await db.send(
      new PutCommand({
        TableName: 'house',
        Item: newHouse,
      })
    );

    res.status(201).json({ message: 'Casa registrada com sucesso', house: newHouse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar a casa' });
  }
});


house.get('/', async (req: Request, res: Response) => {
  try {
    const result = await db.send(
      new ScanCommand({
        TableName: 'house',
        FilterExpression: 'attribute_not_exists(isDeleted)',
      })
    )

    const data = result.Items

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao acessar o DynamoDB' });
  }
});

house.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("ID recebido:", id);
  try {
    const result = await db.send(
      new GetCommand({
        TableName: 'house',
        Key: { name: id }
      })
    );

    if (!result.Item) {
      return res.status(404).json({ error: 'Casa não encontrada' });
    }

    let houseData = result.Item;


    res.status(200).json(houseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao acessar o DynamoDB' });
  }
});

// Rota para atualizar ou criar uma casa
house.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, points, theme, tags, members } = req.body;

  console.log(req.body);
  try {
    const existingHouse = await db.send(
      new GetCommand({
        TableName: 'house',
        Key: { name: id }
      })
    );

    if(points.operation && points.operation !== 'none' && existingHouse.Item) {
      let newPoints = existingHouse.Item.points || 0;
      if(points.operation === 'add') {
        newPoints += points.value;
      } else if(points.operation === 'subtract') {
        newPoints -= points.value;
        if(newPoints < 0) newPoints = 0; // Evita pontos negativos
      }
      existingHouse.Item.points = newPoints;
    }

    const updateData = {
      ...(existingHouse.Item || {}),
      ...(description !== undefined && { description }),
      ...(points !== undefined && { points: existingHouse?.Item?.points }),
      ...(theme !== undefined && { theme }),
      ...(tags !== undefined && { tags }),
      ...(members !== undefined && { members }),
    };

    await db.send(
      new PutCommand({
        TableName: 'house',
        Item: updateData
      })
    );

    res.status(existingHouse.Item ? 200 : 201).json({
      message: existingHouse.Item
        ? 'Casa atualizada com sucesso'
        : 'Casa criada com sucesso'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao acessar o DynamoDB' });
  }
});

// SOFT DELETE
house.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const adminUser = req.headers['x-admin-user'] as string || 'desconhecido';

  try {
    const result = await db.send(
      new GetCommand({
        TableName: 'house',
        Key: { name: id }
      })
    );

    if (!result.Item || result.Item.isDeleted) {
      return res.status(404).json({ error: 'Casa não encontrada ou já deletada' });
    }

    const deletedHouse = {
      ...result.Item,
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      deletedBy: adminUser,
    };

    await db.send(
      new PutCommand({
        TableName: 'house',
        Item: deletedHouse,
      })
    );

    res.json({ message: 'Casa deletada (soft delete) com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar a casa' });
  }
});

export default house;
