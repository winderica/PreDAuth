import { Router } from 'express';
import { getGenerators, getPK, reEncrypt } from '@controllers/auth';

export const auth = Router();

auth.get('/generators', getGenerators);

auth.get('/pk/:peerOrg', getPK);

auth.post('/reEncrypt/:id/:to', reEncrypt);
