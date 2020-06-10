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

    async encrypt(plaintext, pk) {
        const aesKey = this.pre.randomGen();
        const key = await crypto.subtle.importKey(
            'raw',
            new Uint8Array(aesKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16))),
            {
                name: 'AES-CBC',
            },
            false,
            ['encrypt', 'decrypt']
        );
        const iv = crypto.getRandomValues(new Uint8Array(16));
        const data = await crypto.subtle.encrypt(
            {
                name: 'AES-CBC',
                iv
            },
            key,
            plaintext
        );
        const { ca0, ca1 } = this.pre.encrypt(aesKey, this.pre.deserialize(pk, 'G1'), this._g, this._h);
        return {
            data: btoa(String.fromCharCode(...data)),
            key: {
                ca0: this.pre.serialize(ca0),
                ca1: this.pre.serialize(ca1),
            },
            iv: iv.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), ''),
        };
    }

    async decrypt({ data, key: { ca0, ca1 }, iv }, sk) {
        const aesKey = this.pre.decrypt({
            ca0: this.pre.deserialize(ca0, 'Fr'),
            ca1: this.pre.deserialize(ca1, 'G1')
        }, this.pre.deserialize(sk, 'Fr'), this._h);
        const key = await crypto.subtle.importKey(
            'raw',
            new Uint8Array(aesKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16))),
            {
                name: 'AES-CBC',
            },
            false,
            ['encrypt', 'decrypt']
        );
        return crypto.subtle.decrypt(
            {
                name: 'AES-CBC',
                iv: new Uint8Array(iv.match(/.{1,2}/g).map(byte => parseInt(byte, 16))),
            },
            key,
            data
        );
    }
}
