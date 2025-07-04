import express from 'express';
import bot from './robot';
import user from './user';
import books from './books';

const Routes = express.Router();
Routes.use(bot);
Routes.use('/users', user)
Routes.use('/books',books);

export default Routes;