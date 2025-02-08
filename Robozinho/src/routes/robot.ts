import express, { Request, Response } from 'express';
import { FindBook, Robozinho2 } from '../../robot/robo2';

const bot = express.Router();

bot.post('/bot', async (req: Request, res: Response) => {
    try {
        const url = req.body.wUrl as string;
        const baseUrl = "https://www.wattpad.com";
        if(!url || !url.includes(baseUrl)) {
            res.status(400).json({ error: 'URL não informada' })
            return;
        };
        const click = req.body.click as number || 5;
        console.log('Robô iniciado...');
        const wUser = req.body.wUser as string;
        const resultado = await Robozinho2(wUser, url, click); // O Robozinho deve retornar os dados coletados
        
        if (resultado && resultado.length > 0) {
            res.json(resultado);

        } else if (resultado && resultado.length === 0) {
            res.status(200).json({ err: 'Nenhum comentário encontrado' });

        } else {
            res.status(500).json({ err500: 'Erro ao executar o robô' });
        }

    } catch (error) {
        console.error('Erro ao executar o robô:', error);
        res.status(500).json({ error: 'Erro ao executar o robô', details: error });
    }
});

bot.post('/books', async (req, res) => {
    try {
        const book = req.body.book as string;
        const resultado = await FindBook(book);
        res.json(resultado);
    } catch (error) {
        console.error('Erro ao buscar livro:', error);
    };
});

export default bot;