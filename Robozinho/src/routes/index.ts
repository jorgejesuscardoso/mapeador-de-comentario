import express, { Request, Response } from 'express';
import Auths from '../routes/auth';
import bot from './robot';
import User from './users';
import Book from './book';

const Routes = express.Router();
Routes.use(Auths);
Routes.use(bot);
Routes.use(User);
Routes.use(Book);

export default Routes;