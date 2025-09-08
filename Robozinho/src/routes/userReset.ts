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
import { GenerateResetCode } from "../utils/generateResetCode";

const client = new DynamoDBClient({ region: 'us-east-1' }); // ou tua região
const docClient = DynamoDBDocumentClient.from(client);

const userReset = express.Router();



userReset.put('/reset', async (req: Request, res: Response) => {
  const { user: username, code, newpassword } = req.body;

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

    const resetCode = account.resetCode;
    // Valida código de confirmação
    if (code !== resetCode.code) {
      console.log(resetCode)
      return res.status(200).json({ message: 'Código inválido!' });
    } else if (Date.now() > resetCode.expiresAt) {
      return res.status(200).json({ message: 'Código expirado!' });
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

// Rota para solicitar código de redefinição
userReset.post('/request', async (req: Request, res: Response) => {
  const username = req.body.user;
  console.log('Request body:', req.body);
  if (!username) {
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
    const whatsAppNumber = account.whatsappNumber || '';
    
    // Gera código de confirmação
    const resetCode = GenerateResetCode();
    const codeWithExpiration = {
      code: resetCode,
      expiresAt: Date.now() + 15 * 60 * 1000 // Expira em 15 minutos
    }
    // chama api do bot do whatsapp para enviar o código
    const fetch = await axios.post('https://bot-bqxq.onrender.com/sendCode', {
      code: resetCode,
      expiresAt: Date.now() + 15 * 60 * 1000,
      whatsappNumber: whatsAppNumber
    });


    if(fetch.status !== 200) {
      return res.status(500).json({ error: 'Erro ao enviar código via WhatsApp!' });
    }
    // Atualiza usuário no banco
    await db.send(
      new UpdateCommand({
        TableName: 'dbLunar2',
        Key: { user: username },
        UpdateExpression: `
          SET #resetCode = :resetCode,
              #updatedAt = :updatedAt
        `,
        ExpressionAttributeNames: {
          '#resetCode': 'resetCode',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':resetCode': codeWithExpiration,
          ':updatedAt': new Date().toISOString(),
        },
      })
    );  
    console.log('Código de redefinição gerado para usuário:', username);
    // Aqui você enviaria o código via WhatsApp usando uma API externa
    // Exemplo (simulado):
    console.log('Enviando código', codeWithExpiration, `para WhatsApp ${whatsAppNumber}`);
    // Responde sucesso
    res.json({ message: 'Código enviado com sucesso!' });
  } catch (err) {
    console.error('Erro ao gerar código de redefinição:', err);
    res.status(500).json({ error: 'Erro ao gerar código de redefinição!' });
  }
});


export default userReset;
