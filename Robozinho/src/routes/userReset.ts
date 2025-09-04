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

const userReset = express.Router();


userReset.put('/reset', async (req: Request, res: Response) => {
  const { user: username, code, newpassword } = req.body;

    console.log('Senha redefinida para usuário:', req.body);
  if (!username || !code || !newpassword) {
    return res.status(400).json({ error: 'Parâmetros ausentes!' });
  }

  try {
    // Busca usuário
    const result = await db.send(
      new GetCommand({
        TableName: 'dbLunar2',
        Key: { user: username }
      })
    );

    const account = result.Item;

    if (!account || account.deletedAt) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    // Valida código de confirmação
    if (code !== 'resetedira123') {
      return res.status(401).json({ error: 'Código inválido!' });
    }

    // Gera nova senha
    const hashedPassword = await generateHash(newpassword);

    // Atualiza usuário no banco (remove resetCode para não reutilizar)
    await db.send(
      new UpdateCommand({
        TableName: 'dbLunar2',
        Key: { user: username },
        UpdateExpression: `
          SET #password = :password,
              #updatedAt = :updatedAt
        `,
        ExpressionAttributeNames: {
          '#password': 'password',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':password': hashedPassword,
          ':updatedAt': new Date().toISOString(),
        },
      })
    );
    console.log('Senha redefinida para usuário:', req.body);
    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    res.status(500).json({ error: 'Erro ao redefinir senha!' });
  }
});



export default userReset;
