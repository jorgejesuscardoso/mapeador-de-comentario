import express, { Request, Response } from 'express';
import { FindBook, getParagraph, RobozinhoV3 } from '../../robot/robo.v3';

const bot = express.Router();

bot.post('/getComments', async (req: Request, res: Response) => {
    try {
        const url = req.body.wUrl as string;
        console.log('Robô iniciado...');
        const wUser = req.body.wUser as string;
        const resultado = await RobozinhoV3(wUser, url); // O Robozinho deve retornar os dados coletados
        if(!resultado) return console.log("Erro ao buscar comentários.");

        res.status(200).json(resultado);
        return;
    } catch (error) {
        console.error('Erro ao executar o robô:', error);
        res.status(500).json({ error: 'Erro ao executar o robô', details: error });
    }
});

bot.get('/getBooks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await FindBook(id);
        res.json(resultado);
    } catch (error) {
        console.error('Erro ao buscar livro:', error);
    };
});

bot.get('/paragraphs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await getParagraph(id);
        res.json(resultado);
    } catch (error) {
        console.error('Erro ao buscar livro:', error);
    };
})

export default bot;