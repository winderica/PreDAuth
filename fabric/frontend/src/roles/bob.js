import Crypto from 'crypto-js';

export class Bob {
    constructor(pre, g, h) {
        this.pre = pre;
        this._g = this.pre.deserialize(g, 'G1');
        this._h = this.pre.deserialize(h, 'G2');
        const { sk, pk } = this.pre.keyGenInG2(this._h);
        this._sk = sk;
        this._pk = pk;
    }

    get pk() {
        return this.pre.serialize(this._pk);
    }

    reDecrypt(cipher, { cb0, cb1 }, iv) {
        const aesKey = this.pre.reDecrypt({
            cb0: this.pre.deserialize(cb0, 'Fr'),
            cb1: this.pre.deserialize(cb1, 'GT')
        }, this._sk);
        return Crypto.AES.decrypt(cipher, aesKey, {
            iv,
            mode: Crypto.mode.CBC
        }).toString(Crypto.enc.Utf8);
    }
}
