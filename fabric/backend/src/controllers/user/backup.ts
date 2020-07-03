import { getContract } from '@utils/wallet';
import { PostHandler } from '@constants/types';

export const backup: PostHandler<{ id: string }> = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Promise.all([1, 2].map(async (org) => {
            const contract = await getContract(`admin${org}`);
            await contract.evaluateTransaction('backup', id, JSON.stringify(req.body));
        }));
        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
};
