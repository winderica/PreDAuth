import { PRE, Fr, G1, G2 } from './pre';
import { AES } from './aes';

export class Bob {
    readonly #g: G1;
    readonly #h: G2;
    readonly #sk: Fr;
    readonly #pk: G2;

    constructor(private readonly pre: PRE, g: string, h: string) {
        this.#g = this.pre.deserialize(g, 'G1');
        this.#h = this.pre.deserialize(h, 'G2');
        const { sk, pk } = this.pre.keyGenInG2(this.#h);
        this.#sk = sk;
        this.#pk = pk;
    }

    get pk() {
        return this.pre.serialize(this.#pk);
    }

    reDecrypt(cipher: string, { cb0, cb1 }: { cb0: string; cb1: string }, iv: string) {
        const aesKey = this.pre.reDecrypt({
            cb0: this.pre.deserialize(cb0, 'Fr'),
            cb1: this.pre.deserialize(cb1, 'GT')
        }, this.#sk);
        const aes = new AES(Buffer.from(aesKey, 'hex'), Buffer.from(iv, 'hex'));
        return aes.decrypt(cipher);
    }
}
