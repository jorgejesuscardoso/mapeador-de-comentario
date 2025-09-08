import express from 'express';
import bot from './robot';
import user from './user';
import books from './books';
import house from './houses';
import reset from './userReset';
import botRoute from './bot';

const Routes = express.Router();
Routes.use(bot);
Routes.use('/users', user)
Routes.use('/books',books);
Routes.use('/houses',house);
Routes.use('/auth',reset);
Routes.use('/bot',botRoute);

export default Routes;