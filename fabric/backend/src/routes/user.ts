import { Router } from 'express';
import { getData, register, setData } from '@controllers/user';

export const user = Router();

user.post('/register', register);

user.post('/:id/data', setData);

user.get('/:id/data', getData);
