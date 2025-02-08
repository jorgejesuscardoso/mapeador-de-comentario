import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from './routes';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(Routes);

    

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

export default app;
