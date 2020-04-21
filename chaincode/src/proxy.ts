import { PRE } from '../utils/pre';

export class ProxyNode {
    reEncrypt({ ca0, ca1 }: { ca0: string; ca1: string }, rk: string) {
        const { cb0, cb1 } = PRE.reEncrypt({
            ca0: PRE.deserialize(ca0, 'Fr'),
            ca1: PRE.deserialize(ca1, 'G1')
        }, PRE.deserialize(rk, 'G2'));
        return {
            cb0: PRE.serialize(cb0),
            cb1: PRE.serialize(cb1),
        }
    }

    async init() {
        await PRE.init();
    }

    getGH() {
        const { g, h } = PRE.generatorGen("aaa", "bbb");
        return { g: PRE.serialize(g), h: PRE.serialize(h) };
    }
}

