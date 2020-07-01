import { Context, Contract } from 'fabric-contract-api';
import { G1, G2, Fr, PRE } from '../utils/pre';
import { BackupLedger, DataLedger, IdentityLedger } from '../ledger';
import { verify } from '../utils/ecdsa';
import { AES } from '../utils/aes';

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

interface Backup {
    rk: RK;
    email: string;
}

interface Email {
    email: string;
}

interface Recover {
    code: string;
}

class PreDAuthContext extends Context {
    data: DataLedger;
    identity: IdentityLedger;
    backup: BackupLedger;

    constructor() {
        super();
        this.data = new DataLedger(this);
        this.identity = new IdentityLedger(this);
        this.backup = new BackupLedger(this);
    }
}

export class PreDAuth extends Contract {
    pre!: PRE;
    g!: G1;
    h!: G2;
    private sk!: Fr;
    private pk!: G2;

    createContext() {
        return new PreDAuthContext();
    }

    private handleReEncrypt(encrypted: Data, rk: RK) {
        return Object.entries(rk).map(([tag, rk]) => {
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
    }

    private handleReDecrypt(cipher: string, { cb0, cb1 }: { cb0: string; cb1: string }, iv: string) {
        const aesKey = this.pre.reDecrypt({
            cb0: this.pre.deserialize(cb0, 'Fr'),
            cb1: this.pre.deserialize(cb1, 'GT')
        }, this.sk);
        const aes = new AES(Buffer.from(aesKey, 'hex'), Buffer.from(iv, 'hex'));
        return aes.decrypt(cipher);
    }

    async init(_: PreDAuthContext, str1: string, str2: string) {
        this.pre = new PRE();
        await this.pre.init();
        const { g, h } = this.pre.generatorGen(str1, str2);
        this.g = g;
        this.h = h;
        const { sk, pk } = this.pre.keyGenInG2(h);
        this.sk = sk;
        this.pk = pk;
    }

    async getIdentity(ctx: PreDAuthContext, id: string) {
        return await ctx.identity.get([id]);
    }

    async setIdentity(ctx: PreDAuthContext, id: string, request: string) {
        const { nonce, signature, payload }: Request<PK> = JSON.parse(request);
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
        return JSON.stringify(this.handleReEncrypt(encrypted, tagRK));
    }

    async backup(ctx: PreDAuthContext, id: string, request: string) {
        const { nonce, signature, payload: { rk, email } }: Request<Backup> = JSON.parse(request);
        if (!verify(nonce, await this.getIdentity(ctx, id), signature)) {
            throw new Error('Verification failed');
        }
        await ctx.backup.set([id], JSON.stringify({ rk, email }));
    }

    async verifyEmail(ctx: PreDAuthContext, id: string, request: string) {
        const { payload }: Request<Email> = JSON.parse(request);
        const { email }: Backup = JSON.parse(await ctx.backup.get([id]));
        if (email !== payload.email) {
            throw new Error('Verification failed');
        }
        // TODO: send verification code
    }

    async recover(ctx: PreDAuthContext, id: string, request: string) {
        const { payload }: Request<Recover> = JSON.parse(request);
        if (payload.code) {
            // TODO: verify payload
        }
        const { rk }: Backup = JSON.parse(await ctx.backup.get([id]));
        const encrypted: Data = JSON.parse(await this.getData(ctx, id));
        const reEncrypted = this.handleReEncrypt(encrypted, rk);
        return JSON.stringify(
            reEncrypted.map(({ data, key, iv }) => this.handleReDecrypt(data, key, iv))
        );
    }

    getGH() {
        return JSON.stringify({
            g: this.pre.serialize(this.g),
            h: this.pre.serialize(this.h),
        });
    }

    getPK() {
        return JSON.stringify({
            pk: this.pre.serialize(this.pk)
        });
    }
}

