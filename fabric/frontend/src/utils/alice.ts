import { Encrypted, PreKeyPair } from '../constants/types';

import { AES } from './aes';
import { G1, G2, PRE } from './pre';

export class Alice {
    readonly #g: G1;
    readonly #h: G2;

    constructor(public pre: PRE, g: string, h: string) {
        this.#g = this.pre.deserialize(g, 'G1');
        this.#h = this.pre.deserialize(h, 'G2');
    }

    get g() {
        return this.#g;
    }

    get h() {
        return this.#h;
    }

    key(sk?: string): PreKeyPair {
        const key = this.pre.keyGenInG1(this.#g, sk);
        return {
            pk: this.pre.serialize(key.pk),
            sk: this.pre.serialize(key.sk)
        };
    }

    reKey(bobPK: string, sk: string) {
        return this.pre.serialize(this.pre.reKeyGen(this.pre.deserialize(sk, 'Fr'), this.pre.deserialize(bobPK, 'G2')));
    }

    async encrypt(plaintext: string, pk: string): Promise<Encrypted> {
        const aesKey = this.pre.randomGen();
        const aes = new AES(aesKey);
        const data = await aes.encrypt(plaintext);
        const { ca0, ca1 } = this.pre.encrypt(aesKey, this.pre.deserialize(pk, 'G1'), this.#g, this.#h);
        return {
            data,
            key: {
                ca0: this.pre.serialize(ca0),
                ca1: this.pre.serialize(ca1),
            },
            iv: aes.iv,
        };
    }

    async decrypt({ data, key: { ca0, ca1 }, iv }: Encrypted, sk: string) {
        const aesKey = this.pre.decrypt({
            ca0: this.pre.deserialize(ca0, 'Fr'),
            ca1: this.pre.deserialize(ca1, 'G1')
        }, this.pre.deserialize(sk, 'Fr'), this.#h);
        const aes = new AES(aesKey, iv);
        return aes.decrypt(data);
    }
}
