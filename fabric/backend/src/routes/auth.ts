import { Router } from 'express';
import { getGenerators, reEncrypt } from '@controllers/auth';

export const auth = Router();

auth.get('/generators', getGenerators);

auth.post('/reEncrypt/:id/:to', reEncrypt);
