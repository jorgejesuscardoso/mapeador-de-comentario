// user.ts
import db from "../db";
import express, { Request, Response } from 'express';
import { GetCommand, ScanCommand, PutCommand, QueryCommand  } from '@aws-sdk/lib-dynamodb';
import { generateHash, verifyHash } from "../configs/bcrypt";
import axios from "axios";
import { parse } from 'php-array-parser';
import { calculateUserTierByPoints } from "../gamification/tiers";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { GenerateResetCode } from "../utils/generateResetCode";
import { ngrok } from "../ngrok";
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: 'us-east-1' }); // ou tua região
const docClient = DynamoDBDocumentClient.from(client);

const userShop = express.Router();
const id = uuidv4()

// Rota para solicitar compra
userShop.post('/request', async (req: Request, res: Response) => {
  const data = req.body
  const username = data.user
 
  if (!username) {
    return res.status(400).json({ error: 'Dados inválidos!' });
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
    
    // chama api do bot do whatsapp para enviar o código
    const fetch = await axios.post(`${ngrok}/shop`, {
      data,
      whatsappNumber: whatsAppNumber
    });


    if(fetch.status !== 200) {
      return res.status(500).json({ error: 'Erro ao enviar código via WhatsApp!' });
    }


    
    // Atualiza usuário no banco
    const formatedOrders = data.orders.map((s: any) => {
      return {
        service: s.service,
        qtd: s.qtd,
        total: s.total,
        date: new Date().toISOString()
      }
    })
    await db.send(
      new PutCommand({
        TableName: 'sales',
        Item: {
          salesId: id,
          user: username,
          order: data.orders,
          createdAt: new Date().toISOString(),
          wtp: data.wtp,
          status: 'unread'
        }
       
      })
    );  
    console.log('Requesição de compra para usuário:', username);
    // Aqui você enviaria o código via WhatsApp usando uma API externa
    // Exemplo (simulado):
    console.log('Enviando o pedido',`para WhatsApp ${whatsAppNumber}`);
    // Responde sucesso
    res.status(200).json({ message: 'Pedido enviado com sucesso!' });
  } catch (err) {
    console.error('Erro ao gerar pedido de compra:', err);
    res.status(500).json({ error: 'Erro ao gerar pedido de compra!' });
  }
});

userShop.get('/', async (req: Request, res: Response) => {
  try {
    // Busca usuário
    const result = await db.send(
      new ScanCommand({
        TableName: 'sales',
      })
    );

    // Responde sucesso
    res.status(200).json(result.Items);
  } catch (err) {
    console.error('Erro ao atualizar pedido de compra:', err);
    res.status(500).json({ error: 'Erro ao atualizar pedido de compra!' });
  }
});

userShop.put('/update', async (req: Request, res: Response) => {
  const data = req.body
  const username = data.user
  
  if (!username) {
    return res.status(400).json({ error: 'Dados inválidos!' });
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

    // Atualiza usuário no banco
    const formatedOrders = data.orders.map((s: any) => {
      return {
        service: s.service,
        qtd: s.qtd,
        total: s.total,
        date: new Date().toISOString()
      }
    })
    await db.send(
      new UpdateCommand({
        TableName: 'dbLunar2',
        Key: { user: username },
        UpdateExpression: `
          SET #orders = :orders,
              #updatedAt = :updatedAt
        `,
        ExpressionAttributeNames: {
          '#orders': 'orders',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':orders': formatedOrders,
          ':updatedAt': new Date().toISOString(),
        },
      })
    );  
    // Responde sucesso
    res.status(200).json({ message: 'Pedido atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar pedido de compra:', err);
    res.status(500).json({ error: 'Erro ao atualizar pedido de compra!' });
  }
});

export default userShop;
