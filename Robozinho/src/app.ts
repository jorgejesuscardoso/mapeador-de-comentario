import express from 'express';
import cors from 'cors';
import Robozinho from '../robot/robot';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        console.log('Robô iniciado...');

        const resultado = await Robozinho(); // O Robozinho deve retornar os dados coletados

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

export default app;
