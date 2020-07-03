import { getContract } from '@utils/wallet';
import { GetHandler } from '@constants/types';

export const getPKs: GetHandler = async (_req, res, next) => {
    try {
        res.json({
            ok: true,
            payload: {
                pks: await Promise.all([1, 2].map(async (org) => {
                    const contract = await getContract(`admin${org}`);
                    const result = await contract.evaluateTransaction('getPK');
                    return JSON.parse(result.toString('utf8')).pk;
                }))
            },
        });
    } catch (e) {
        next(e);
    }
};
