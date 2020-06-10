import { Context, Contract } from 'fabric-contract-api';
import { G1, G2, PRE } from '../utils/pre';
import { DataLedger, IdentityLedger } from '../ledger';
import { verify } from '../utils/ecdsa';

interface Request<T> {
    nonce: string;
    signature: string;
    payload: T;
}

interface PK {
    publicKey: string;
}

interface Data {
    [tag: string]: {
        key: {
            ca0: string;
            ca1: string;
        };
        data: string;
        iv: string;
    };
}

interface RK {
    [tag: string]: string;
}

class PreDAuthContext extends Context {
    data: DataLedger;
    identity: IdentityLedger;

    constructor() {
        super();
        this.data = new DataLedger(this);
        this.identity = new IdentityLedger(this);
    }

}

export class PreDAuth extends Contract {
    pre!: PRE;
    g!: G1;
    h!: G2;

    createContext() {
        return new PreDAuthContext();
    }

    async init(_: PreDAuthContext, str1: string, str2: string) {
        this.pre = new PRE();
        await this.pre.init();
        const { g, h } = this.pre.generatorGen(str1, str2);
        this.g = g;
        this.h = h;
    }

    async getIdentity(ctx: PreDAuthContext, id: string) {
        return await ctx.identity.get([id]);
    }

    async setIdentity(ctx: PreDAuthContext, id: string, request: string) {
        const { nonce, signature, payload }: Request<PK> = JSON.parse(request);
        console.log(await this.getIdentity(ctx, id));
        console.log(payload.publicKey);
        const publicKey = await this.getIdentity(ctx, id) || payload.publicKey;
        if (!verify(nonce, publicKey, signature)) {
            throw new Error('Verification failed');
        }
        await ctx.identity.set([id], payload.publicKey);
    }

    async getData(ctx: PreDAuthContext, id: string) {
        return ctx.data.get([id]);
    }

    async setData(ctx: PreDAuthContext, id: string, request: string) {
        const { nonce, signature, payload }: Request<Data> = JSON.parse(request);
        if (!verify(nonce, await this.getIdentity(ctx, id), signature)) {
            throw new Error('Verification failed');
        }
        await ctx.data.set([id], JSON.stringify(payload));
    }

    async reEncrypt(ctx: PreDAuthContext, id: string, request: string) {
        const { nonce, signature, payload: tagRK }: Request<RK> = JSON.parse(request);
        if (!verify(nonce, await this.getIdentity(ctx, id), signature)) {
            throw new Error('Verification failed');
        }
        const encrypted: Data = JSON.parse(await this.getData(ctx, id));
        const res = Object.entries(tagRK).map(([tag, rk]) => {
            const { key: { ca0, ca1 }, data, iv } = encrypted[tag];
            const { cb0, cb1 } = this.pre.reEncrypt({
                ca0: this.pre.deserialize(ca0, 'Fr'),
                ca1: this.pre.deserialize(ca1, 'G1')
            }, this.pre.deserialize(rk, 'G2'));
            return {
                data,
                key: {
                    cb0: this.pre.serialize(cb0),
                    cb1: this.pre.serialize(cb1),
                },
                iv,
            };
        });
        return JSON.stringify(res);
    }

    getGH() {
        return JSON.stringify({
            g: this.pre.serialize(this.g),
            h: this.pre.serialize(this.h),
        });
    }
}

