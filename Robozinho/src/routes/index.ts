import express from 'express';
import bot from './robot';

const Routes = express.Router();
Routes.use(bot);

export default Routes;