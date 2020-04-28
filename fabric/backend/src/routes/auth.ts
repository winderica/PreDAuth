import { Router } from 'express';
import { getContract } from '../utils/wallet';
import fetch from 'node-fetch';

export const auth = Router();

auth.get('/generators/:id', async (req, res, next) => {
    try {
        const contract = await getContract(req.params.id);
        const result = await contract.evaluateTransaction('getGH');
        res.json({
            ok: true,
            payload: JSON.parse(result.toString('utf8')),
        });
    } catch (e) {
        next(e);
    }
});

auth.post('/reEncrypt/:id/:to', async (req, res, next) => {
    try {
        const { rk } = req.body;
        const { id, to } = req.params;
        const contract = await getContract(id);
        const result = await contract.evaluateTransaction('reEncrypt', id, rk);
        await fetch(to, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: result.toString('utf8')
        });
        res.json(JSON.parse(result.toString('utf8')));
    } catch (e) {
        next(e);
    }
});
