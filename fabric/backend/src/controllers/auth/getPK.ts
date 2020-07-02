import { getContract } from '@utils/wallet';
import { GetHandler } from '@constants/types';

export const getPK: GetHandler<{ peerOrg: string }> = async (req, res, next) => {
    try {
        const { peerOrg } = req.params;
        const contract = await getContract(`admin${peerOrg}`, +peerOrg);
        const result = await contract.evaluateTransaction('getPK');
        res.json({
            ok: true,
            payload: JSON.parse(result.toString('utf8')),
        });
    } catch (e) {
        next(e);
    }
};
