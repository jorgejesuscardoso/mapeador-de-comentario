import express, { Request, Response } from 'express';
import Auths from '../routes/auth';

const Routes = express.Router();
Routes.use(Auths);

export default Routes;