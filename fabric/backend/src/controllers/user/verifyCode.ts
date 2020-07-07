import { getContract } from '@utils/wallet';
import { PostHandler } from '@constants/types';

export const verifyCode: PostHandler<{ id: string }> = async (req, res, next) => {
    try {
        const { id } = req.params;
        res.json({
            ok: true,
            payload: {
                data: await Promise.all([1, 2].map(async (org) => {
                    const contract = await getContract(`admin${org}`);
                    const result = await contract.evaluateTransaction('recover', id, JSON.stringify(req.body));
                    return JSON.parse(result.toString('utf8') || '{}').data;
                }))
            }
        });
    } catch (e) {
        next(e);
    }
};
