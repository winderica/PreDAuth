import { getContract } from '@utils/wallet';
import { GetHandler } from '@constants/types';

export const verifyCode: GetHandler<{ id: string }> = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contract = await getContract('admin1'); // TODO: multiple peers
        const result = await contract.evaluateTransaction('recover', id, JSON.stringify(req.body));
        res.json({ ok: true, payload: JSON.parse(result.toString('utf8') || '{}') });
    } catch (e) {
        next(e);
    }
};
