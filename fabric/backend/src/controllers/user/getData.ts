import { getContract } from '@utils/wallet';
import { GetHandler } from '@constants/types';

export const getData: GetHandler<{ id: string }> = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contract = await getContract('admin');
        const result = await contract.evaluateTransaction('getData', id);
        res.json({ ok: true, payload: JSON.parse(result.toString('utf8')) });
    } catch (e) {
        next(e);
    }
};
