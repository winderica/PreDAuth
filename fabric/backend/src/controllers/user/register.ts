import { getContract } from '@utils/wallet';
import { PostHandler } from '@constants/types';

export const register: PostHandler<{ id: string }> = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contract = await getContract('admin1');
        const result = await contract.submitTransaction('getIdentity', id);
        if (result.length) {
            return res.json({ ok: false, payload: { message: '用户已存在' } });
        }
        await contract.submitTransaction('setIdentity', id, JSON.stringify(req.body));
        return res.json({ ok: true });
    } catch (e) {
        return next(e);
    }
};
