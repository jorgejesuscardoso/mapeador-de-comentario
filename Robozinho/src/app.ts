import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from './routes';

import path from 'path';

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
            origin: '*', // REMOVA as barras finais "/"
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'x-user'],
            credentials: true,
        }));

        // Middleware para tratar preflight requests
        this.app.use((req: Request, res: Response, next: NextFunction): void => {
            res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
            res.header('Access-Control-Allow-Credentials', 'true');
        
            if (req.method === 'OPTIONS') {
                res.sendStatus(204); // Retorna OK para preflight requests
                return;
            }
        
            next();
        });

        const resp = {
            launcher: "5.0.0.0",
            otc: "1.0.0.0",
            classic: "1.0.0.0"
        }
        this.app.use(express.json());
        this.app.use('/static', express.static(path.join(__dirname, '../public')));
        this.app.get('/versions', (req, res) => {
            res.json(resp);
        });
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

// Fetch periodico para google
setInterval(() => {
    fetch('https://www.google.com')
        .then()
        .catch(err => console.error('Google:', err));
}, 1000 * 60 * 5); // 5 minutos
