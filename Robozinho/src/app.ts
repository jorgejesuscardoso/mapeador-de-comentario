import express from 'express';
import cors from 'cors';
import Robozinho from '../robot/robot';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/bot', async (req, res) => {
    try {
        const url = req.body.wUrl as string || 'https://www.wattpad.com/1503437794-darkbonds-capítulo-2-o-ataque-ao-culto';
        const click = req.body.click as number || 15;
        console.log('Robô iniciado...');

        const resultado = await Robozinho(url, click); // O Robozinho deve retornar os dados coletados

        if (resultado) {
            res.json(resultado);
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
