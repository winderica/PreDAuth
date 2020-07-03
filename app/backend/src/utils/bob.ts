import { PRE, Fr, G1, G2 } from './pre';
import { AES } from './aes';

export class Bob {
    private readonly _g: G1;
    private readonly _h: G2;
    private readonly _sk: Fr;
    private readonly _pk: G2;

    constructor(private readonly pre: PRE, g: string, h: string) {
        this._g = this.pre.deserialize(g, 'G1');
        this._h = this.pre.deserialize(h, 'G2');
        const { sk, pk } = this.pre.keyGenInG2(this._h);
        this._sk = sk;
        this._pk = pk;
    }

    get pk() {
        return this.pre.serialize(this._pk);
    }

    reDecrypt(cipher: string, { cb0, cb1 }: { cb0: string; cb1: string }, iv: string) {
        const aesKey = this.pre.reDecrypt({
            cb0: this.pre.deserialize(cb0, 'Fr'),
            cb1: this.pre.deserialize(cb1, 'GT')
        }, this._sk);
        const aes = new AES(Buffer.from(aesKey, 'hex'), Buffer.from(iv, 'hex'));
        return aes.decrypt(cipher);
    }
}
