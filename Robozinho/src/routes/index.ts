import express from 'express';
import bot from './robot';
import user from './user';
import books from './books';
import house from './houses';
import reset from './userReset';

const Routes = express.Router();
Routes.use(bot);
Routes.use('/users', user)
Routes.use('/books',books);
Routes.use('/houses',house);
Routes.use('/auth',reset);

export default Routes;