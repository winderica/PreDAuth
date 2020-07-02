import { Router } from 'express';
import { backup, getData, register, sendCode, setData, verifyCode } from '@controllers/user';

export const user = Router();

user.post('/register', register);

user.post('/:id/backup', backup);

user.post('/:id/data', setData);

user.get('/:id/data', getData);

user.get('/:id/code', sendCode);

user.post('/:id/code', verifyCode);
