import { Fr, G1, G2 } from "mcl-wasm";
import { PRE } from '../utils/pre';
import { AES } from '../utils/aes';

export class Bob {
    private readonly _g!: G1;
    private readonly _h!: G2;
    private readonly _sk!: Fr;
    private readonly _pk!: G2;

    constructor(g: string, h: string) {
        this._g = PRE.deserialize(g, 'G1');
        this._h = PRE.deserialize(h, 'G2');
        const { sk, pk } = PRE.keyGenInG2(this._h);
        this._sk = sk;
        this._pk = pk;
    }

    get pk() {
        return PRE.serialize(this._pk);
    }

    reDecrypt(cipher: string, { cb0, cb1 }: { cb0: string; cb1: string }, iv: string) {
        const aesKey = PRE.reDecrypt({
            cb0: PRE.deserialize(cb0, 'Fr'),
            cb1: PRE.deserialize(cb1, 'GT')
        }, this._sk);
        const aes = new AES(Buffer.from(aesKey, 'hex'), Buffer.from(iv, 'hex'));
        return aes.decrypt(cipher);
    }
}
