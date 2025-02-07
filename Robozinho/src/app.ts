import express, { Request, Response } from 'express';
import cors from 'cors';
import Robozinho from '../robot/robot';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/bot', async (req, res) => {
    try {
        const url = req.body.wUrl as string || "https://www.wattpad.com/1501648271-darkbonds-cap%C3%ADtulo-2-o-ataque-ao-culto/page/10";
        if(!url) {
            res.status(400).json({ error: 'URL não informada' })
            return;
        };
        const click = req.body.click as number || 15;
        console.log('Robô iniciado...');
        const wUser = req.body.wUser as string || 'JcBushido';
        const resultado = await Robozinho(wUser, url, click); // O Robozinho deve retornar os dados coletados
        
        if (resultado && resultado.length > 0) {
            res.json(resultado);

        } else if (resultado && resultado.length === 0) {
            res.status(404).json({ 404: 'Nenhum comentário encontrado' });

        } else {
            res.status(500).json({ error: 'Erro ao executar o robô' });
        }

    } catch (error) {
        console.error('Erro ao executar o robô:', error);
        res.status(500).json({ error: 'Erro ao executar o robô', details: error });
    }
});

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

export default app;
