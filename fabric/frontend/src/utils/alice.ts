import { G1, G2, PRE } from './pre';

export interface PreKeyPair {
    pk: string;
    sk: string;
}

export interface Encrypted {
    data: string;
    key: {
        ca0: string;
        ca1: string;
    };
    iv: string;
}

export class Alice {
    readonly #g: G1;
    readonly #h: G2;

    constructor(private pre: PRE, g: string, h: string) {
        this.#g = this.pre.deserialize(g, 'G1');
        this.#h = this.pre.deserialize(h, 'G2');
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
        const key = await crypto.subtle.importKey(
            'raw',
            new Uint8Array(aesKey.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) ?? []),
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
            new TextEncoder().encode(plaintext)
        );
        const { ca0, ca1 } = this.pre.encrypt(aesKey, this.pre.deserialize(pk, 'G1'), this.#g, this.#h);
        return {
            data: btoa(String.fromCharCode(...new Uint8Array(data))),
            key: {
                ca0: this.pre.serialize(ca0),
                ca1: this.pre.serialize(ca1),
            },
            iv: iv.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), ''),
        };
    }

    async decrypt({ data, key: { ca0, ca1 }, iv }: Encrypted, sk: string) {
        const aesKey = this.pre.decrypt({
            ca0: this.pre.deserialize(ca0, 'Fr'),
            ca1: this.pre.deserialize(ca1, 'G1')
        }, this.pre.deserialize(sk, 'Fr'), this.#h);
        const key = await crypto.subtle.importKey(
            'raw',
            new Uint8Array(aesKey.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) ?? []),
            {
                name: 'AES-CBC',
            },
            false,
            ['encrypt', 'decrypt']
        );
        return new TextDecoder().decode(await crypto.subtle.decrypt(
            {
                name: 'AES-CBC',
                iv: new Uint8Array(iv.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) ?? []),
            },
            key,
            Uint8Array.from([...atob(data)].map(i => i.charCodeAt(0)))
        ));
    }
}
