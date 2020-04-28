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
        const { data, key: { ca0, ca1 }, iv } = req.body;
        const contract = await getContract(req.params.id);
        await contract.submitTransaction('saveData', req.params.id, data, ca0, ca1, iv);
        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
});
