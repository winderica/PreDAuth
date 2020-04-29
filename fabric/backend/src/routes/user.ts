import { Router } from 'express';
import { addUser, getContract } from '../utils/wallet';

export const user = Router();

user.post('/register', async (req, res, next) => {
    try {
        const { id } = req.body;
        await addUser(id);
        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
});

user.post('/:id/data', async (req, res, next) => {
    try {
        const contract = await getContract(req.params.id);
        await contract.submitTransaction('saveData', req.params.id, JSON.stringify(req.body));
        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
});

user.get('/:id/data', async (req, res, next) => {
    try {
        const contract = await getContract(req.params.id);
        res.json({ ok: true, payload: JSON.parse(await contract.evaluateTransaction('getData', req.params.id)) });
    } catch (e) {
        next(e);
    }
});
