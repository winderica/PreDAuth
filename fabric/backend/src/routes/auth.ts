import { Router } from 'express';
import { getGenerators, getPKs, reEncrypt } from '@controllers/auth';

export const auth = Router();

auth.get('/generators', getGenerators);

auth.get('/pks', getPKs);

auth.post('/reEncrypt/:id/:to', reEncrypt);
