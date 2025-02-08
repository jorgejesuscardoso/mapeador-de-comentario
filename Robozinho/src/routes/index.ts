import express, { Request, Response } from 'express';
import Auths from '../routes/auth';
import bot from './robot';
import User from './users';

const Routes = express.Router();
Routes.use(Auths);
Routes.use(bot);
Routes.use(User);

export default Routes;