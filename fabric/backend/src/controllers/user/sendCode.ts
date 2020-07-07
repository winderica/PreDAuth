import { getContract } from '@utils/wallet';
import { GetHandler } from '@constants/types';

export const sendCode: GetHandler<{ id: string; email: string }> = async (req, res, next) => {
    try {
        const { id, email } = req.params;
        const contract = await getContract('admin1');
        await contract.evaluateTransaction('verifyEmail', id, JSON.stringify({ payload: { email } }));
        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
};
