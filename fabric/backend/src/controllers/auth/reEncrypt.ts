import got from 'got';
import { getContract } from '@utils/wallet';
import { GetHandler } from '@constants/types';

export const reEncrypt: GetHandler<{ id: string; to: string }> = async (req, res, next) => {
    try {
        const { id, to } = req.params;
        const contract = await getContract('admin1');
        const result = await contract.evaluateTransaction('reEncrypt', id, JSON.stringify(req.body));
        const json = JSON.parse(result.toString('utf8'));
        await got.post(to, { json });
        res.json(json);
    } catch (e) {
        next(e);
    }
};
