import { Fr, G1, G2 } from "mcl-wasm";
import { PRE } from '../utils/pre';
import * as crypto from "crypto";
import { AES } from '../utils/aes';

export class Alice {
    private readonly _g!: G1;
    private readonly _h!: G2;
    private readonly _sk!: Fr;
    private readonly _pk!: G1;

    constructor(g: string, h: string) {
        this._g = PRE.deserialize(g, 'G1');
        this._h = PRE.deserialize(h, 'G2');
        const { sk, pk } = PRE.keyGenInG1(this._g);
        this._sk = sk;
        this._pk = pk;
    }

    get pk() {
        return PRE.serialize(this._pk);
    }

    encrypt(plaintext: string) {
        const aesKey = PRE.randomGen();
        const iv = crypto.randomBytes(16);
        const aes = new AES(Buffer.from(aesKey, 'hex'), iv);
        const cipher = aes.encrypt(plaintext);
        const { ca0, ca1 } = PRE.encrypt(aesKey, this._pk, this._g, this._h);
        return {
            cipher,
            key: {
                ca0: PRE.serialize(ca0),
                ca1: PRE.serialize(ca1),
            },
            iv: iv.toString('hex'),
        };
    }

    decrypt(cipher: string, { ca0, ca1 }: { ca0: string; ca1: string }, iv: string) {
        const aesKey = PRE.decrypt({
            ca0: PRE.deserialize(ca0, 'Fr'),
            ca1: PRE.deserialize(ca1, 'G1')
        }, this._sk, this._h);
        const aes = new AES(Buffer.from(aesKey, 'hex'), Buffer.from(iv, 'hex'));
        return aes.decrypt(cipher);
    }

    reKey(pk: string) {
        return PRE.serialize(PRE.reKeyGen(this._sk, PRE.deserialize(pk, 'G2')));
    }
}
