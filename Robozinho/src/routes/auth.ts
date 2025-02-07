import express, { Request, Response } from 'express';
import Auth from '../auth/login';

const Auths = express.Router();
const Aut = new Auth();

Auths.post('/auth', async (req: Request, res: Response) => {
   res.json(await Aut.auth(req.body.user, req.body.password));
});

Auths.get('/getAllAdm', async (req: Request, res: Response) => {
        res.json(await Aut.getAllAdm());
    }
);


export default Auths;
