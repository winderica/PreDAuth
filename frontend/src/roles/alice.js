import Crypto from 'crypto-js';

export class Alice {
    constructor(pre, g, h) {
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

    encrypt(plaintext) {
        const aesKey = this.pre.randomGen();
        const iv = Crypto.lib.WordArray.random(16);
        const cipher = Crypto.AES.encrypt(plaintext, aesKey, {
            iv,
            mode: Crypto.mode.CBC
        }).toString();
        const { ca0, ca1 } = this.pre.encrypt(aesKey, this._pk, this._g, this._h);
        return {
            cipher,
            key: {
                ca0: this.pre.serialize(ca0),
                ca1: this.pre.serialize(ca1),
            },
            iv: iv.toString(),
        };
    }

    decrypt(cipher, { ca0, ca1 }, iv) {
        const aesKey = this.pre.decrypt({
            ca0: this.pre.deserialize(ca0, 'Fr'),
            ca1: this.pre.deserialize(ca1, 'G1')
        }, this._sk, this._h);
        return Crypto.AES.decrypt(cipher, aesKey, {
            iv,
            mode: Crypto.mode.CBC
        }).toString(Crypto.enc.Utf8);
    }

    reKey(pk) {
        return this.pre.serialize(this.pre.reKeyGen(this._sk, this.pre.deserialize(pk, 'G2')));
    }
}
