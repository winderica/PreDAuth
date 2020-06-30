import { getContract } from '@utils/wallet';
import { PostHandler } from '@constants/types';

export const setData: PostHandler<{ id: string }> = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contract = await getContract('admin');
        await contract.submitTransaction('setData', id, JSON.stringify(req.body));
        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
};
