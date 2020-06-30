import { getContract } from '@utils/wallet';
import { GetHandler } from '@constants/types';

export const getGenerators: GetHandler = async (_req, res, next) => {
    try {
        const contract = await getContract('admin');
        const result = await contract.evaluateTransaction('getGH');
        res.json({
            ok: true,
            payload: JSON.parse(result.toString('utf8')),
        });
    } catch (e) {
        next(e);
    }
};
