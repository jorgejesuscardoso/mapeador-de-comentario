import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from './routes';

dotenv.config();

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    // Configuração de middlewares (CORS, JSON, etc.)
    private middlewares(): void {
        this.app.use(cors({
            origin: '*', // Substitua conforme necessário
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
            credentials: true,
        }));

        this.app.options('*', cors()); // Permite preflight requests

        this.app.use(express.json());
    }

    // Configuração de rotas
    private routes(): void {
        this.app.use(Routes);
        this.app.get('/', (req, res) => {
            res.json({ status: 'ok' });
        });
    }

    // Método para iniciar o servidor
    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`🚀 Servidor rodando na porta ${port}`);
        });
    }
}

// Exportando uma instância da classe
export default new App().app;
