import { Fr, G1, G2 } from 'mcl';
import { PRE } from '../utils/pre';
import * as crypto from 'crypto';
import { AES } from '../utils/aes';

export class Alice {
    private readonly _g!: G1;
    private readonly _h!: G2;
    private readonly _sk!: Fr;
    private readonly _pk!: G1;
    private readonly pre: PRE;

    constructor(pre: PRE, g: string, h: string) {
        this.pre = pre;
        this._g = this.pre.deserialize(g, 'G1');
        this._h = this.pre.deserialize(h, 'G2');
        const { sk, pk } = this.pre.keyGenInG1(this._g);
        this._sk = sk;
        this._pk = pk;
    }

    get pk() {
        return this.pre.serialize(this._pk);
    }

    encrypt(plaintext: string) {
        const aesKey = this.pre.randomGen();
        const iv = crypto.randomBytes(16);
        const aes = new AES(Buffer.from(aesKey, 'hex'), iv);
        const cipher = aes.encrypt(plaintext);
        const { ca0, ca1 } = this.pre.encrypt(aesKey, this._pk, this._g, this._h);
        return {
            cipher,
            key: {
                ca0: this.pre.serialize(ca0),
                ca1: this.pre.serialize(ca1),
            },
            iv: iv.toString('hex'),
        };
    }

    decrypt(cipher: string, { ca0, ca1 }: { ca0: string; ca1: string }, iv: string) {
        const aesKey = this.pre.decrypt({
            ca0: this.pre.deserialize(ca0, 'Fr'),
            ca1: this.pre.deserialize(ca1, 'G1')
        }, this._sk, this._h);
        const aes = new AES(Buffer.from(aesKey, 'hex'), Buffer.from(iv, 'hex'));
        return aes.decrypt(cipher);
    }

    reKey(pk: string) {
        return this.pre.serialize(this.pre.reKeyGen(this._sk, this.pre.deserialize(pk, 'G2')));
    }
}
