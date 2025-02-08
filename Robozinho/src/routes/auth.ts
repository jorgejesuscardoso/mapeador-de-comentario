import express, { Request, Response, Router } from 'express';
import Auth from '../auth/login';

const Auths = Router();
const Aut = new Auth();

Auths.post('/auth', async (req: Request, res: Response) => {
   res.json(await Aut.auth(req.body.user, req.body.password));
});


export default Auths;
