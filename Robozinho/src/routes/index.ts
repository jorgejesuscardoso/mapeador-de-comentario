import express from 'express';
import bot from './robot';
import user from './user';

const Routes = express.Router();
Routes.use(bot);
Routes.use('/users', user)

export default Routes;