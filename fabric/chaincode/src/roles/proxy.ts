import { PRE } from '../utils/pre';

export class ProxyNode {
    constructor(private readonly pre: PRE) {
    }

    reEncrypt({ ca0, ca1 }: { ca0: string; ca1: string }, rk: string) {
        const { cb0, cb1 } = this.pre.reEncrypt({
            ca0: this.pre.deserialize(ca0, 'Fr'),
            ca1: this.pre.deserialize(ca1, 'G1')
        }, this.pre.deserialize(rk, 'G2'));
        return {
            cb0: this.pre.serialize(cb0),
            cb1: this.pre.serialize(cb1),
        };
    }

    getGH() {
        const { g, h } = this.pre.generatorGen('aaa', 'bbb');
        return { g: this.pre.serialize(g), h: this.pre.serialize(h) };
    }
}

