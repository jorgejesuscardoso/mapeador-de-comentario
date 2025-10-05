// bot.ts
import db from "../db";
import express, { Request, Response } from 'express';
import { GetCommand, ScanCommand, PutCommand, QueryCommand  } from '@aws-sdk/lib-dynamodb';
import { generateHash, verifyHash } from "../configs/bcrypt";
import axios from "axios";
import { parse } from 'php-array-parser';
import { calculateUserTierByPoints } from "../gamification/tiers";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' }); // ou tua região
const docClient = DynamoDBDocumentClient.from(client);

const bot = express.Router();


// envia status do bot
bot.get('/status', async (req: Request, res: Response) => {
    try {
      res.status(200).json({ status: 'Bot is running' });
    } catch (error) {
        console.error('Erro ao verificar status do bot:', error);
        res.status(500).json({ message: 'Erro ao verificar status do bot' });
    }
});


export default bot;
