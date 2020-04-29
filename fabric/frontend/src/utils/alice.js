import Crypto from 'crypto-js';

export class Alice {
    constructor(pre, g, h) {
        this.pre = pre;
        this._g = this.pre.deserialize(g, 'G1');
        this._h = this.pre.deserialize(h, 'G2');
    }

    key(sk) {
        const key = this.pre.keyGenInG1(this._g, sk);
        return {
            pk: this.pre.serialize(key.pk),
            sk: this.pre.serialize(key.sk)
        };
    }

    reKey(bobPK, sk) {
        return this.pre.serialize(this.pre.reKeyGen(this.pre.deserialize(sk, 'Fr'), this.pre.deserialize(bobPK, 'G2')));
    }

    encrypt(plaintext, pk) {
        const aesKey = this.pre.randomGen();
        const iv = Crypto.lib.WordArray.random(16);
        const data = Crypto.AES.encrypt(plaintext, Crypto.enc.Hex.parse(aesKey), {
            iv,
            mode: Crypto.mode.CBC
        }).toString();
        const { ca0, ca1 } = this.pre.encrypt(aesKey, this.pre.deserialize(pk, 'G1'), this._g, this._h);
        return {
            data,
            key: {
                ca0: this.pre.serialize(ca0),
                ca1: this.pre.serialize(ca1),
            },
            iv: iv.toString(),
        };
    }

    decrypt({ data, key: { ca0, ca1 }, iv }, sk) {
        const aesKey = this.pre.decrypt({
            ca0: this.pre.deserialize(ca0, 'Fr'),
            ca1: this.pre.deserialize(ca1, 'G1')
        }, this.pre.deserialize(sk, 'Fr'), this._h);
        return Crypto.AES.decrypt(data, Crypto.enc.Hex.parse(aesKey), {
            iv: Crypto.enc.Hex.parse(iv),
            mode: Crypto.mode.CBC
        }).toString(Crypto.enc.Utf8);
    }
}
