import { PreKeyPair, ReEncrypted } from '../constants/types';

import { AES } from './aes';
import { G1, G2, Fr, PRE } from './pre';

export class Bob {
    readonly #g: G1;
    readonly #h: G2;
    readonly #sk: Fr;
    readonly #pk: G2;

    constructor(private pre: PRE, g: G1, h: G2) {
        this.#g = g;
        this.#h = h;
        const { sk, pk } = this.pre.keyGenInG2(this.#h);
        this.#sk = sk;
        this.#pk = pk;
    }

    get key(): PreKeyPair {
        return {
            pk: this.pre.serialize(this.#pk),
            sk: this.pre.serialize(this.#sk)
        };
    }

    async reDecrypt({ data, key: { cb0, cb1 }, iv }: ReEncrypted) {
        const aesKey = this.pre.reDecrypt({
            cb0: this.pre.deserialize(cb0, 'Fr'),
            cb1: this.pre.deserialize(cb1, 'GT')
        }, this.#sk);
        const aes = new AES(aesKey, iv);
        return aes.decrypt(data);
    }
}
