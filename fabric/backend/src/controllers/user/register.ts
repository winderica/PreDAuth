import { getContract } from '@utils/wallet';
import { PostHandler } from '@constants/types';

export const register: PostHandler<{}, { id: string }> = async (req, res, next) => {
    try {
        const { id, ...others } = req.body;
        const contract = await getContract('admin');
        await contract.submitTransaction('setIdentity', id, JSON.stringify(others));
        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
};
