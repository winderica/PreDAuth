import express from 'express';
import { auth } from './auth';
import { user } from './user';

export const routes = express();

routes.use('/auth', auth);
routes.use('/user', user);
