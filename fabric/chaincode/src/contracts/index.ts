import { Context, Contract } from 'fabric-contract-api';
import { BackupLedger, CodeLedger, DataLedger, IdentityLedger, RecoveryLedger } from '../ledger';
import { verify } from '../utils/ecdsa';
import { AES } from '../utils/aes';
import { randomCode } from '../utils/code';
import { Fr, G1, G2, PRE } from '../utils/pre';
import { mailto } from '../utils/mail';
import { Backup, Data, PK, Request, RK } from '../constants/types';

class PreDAuthContext extends Context {
    data: DataLedger;
    identity: IdentityLedger;
    recovery: RecoveryLedger;
    backup: BackupLedger;
    code: CodeLedger;

    constructor() {
        super();
        this.data = new DataLedger(this);
        this.identity = new IdentityLedger(this);
        this.recovery = new RecoveryLedger(this);
        this.backup = new BackupLedger(this);
        this.code = new CodeLedger(this);
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
        return Object.fromEntries(Object.entries(rk).map(([tag, rk]) => {
            const { key: { ca0, ca1 }, data, iv } = encrypted[tag];
            const { cb0, cb1 } = this.pre.reEncrypt({
                ca0: this.pre.deserialize(ca0, 'Fr'),
                ca1: this.pre.deserialize(ca1, 'G1')
            }, this.pre.deserialize(rk, 'G2'));
            return [
                tag,
                {
                    data,
                    key: {
                        cb0: this.pre.serialize(cb0),
                        cb1: this.pre.serialize(cb1),
                    },
                    iv,
                }
            ];
        }));
    }

    private handleReDecrypt(cipher: string, { cb0, cb1 }: { cb0: string; cb1: string }, iv: string) {
        const aesKey = this.pre.reDecrypt({
            cb0: this.pre.deserialize(cb0, 'Fr'),
            cb1: this.pre.deserialize(cb1, 'GT')
        }, this.sk);
        const aes = new AES(Buffer.from(aesKey, 'hex'), Buffer.from(iv, 'hex'));
        return aes.decrypt(cipher);
    }

    async init(ctx: PreDAuthContext, str1: string, str2: string) {
        this.pre = new PRE();
        await this.pre.init();
        const { g, h } = this.pre.generatorGen(str1, str2);
        this.g = g;
        this.h = h;
        const { sk, pk } = this.pre.keyGenInG2(h);
        this.sk = sk;
        this.pk = pk;
        /* eslint-disable */
        ctx.backup.init((ctx.stub as any).getMspID());
        ctx.code.init((ctx.stub as any).getMspID());
        /* eslint-enable */
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
        return await ctx.data.get([id]);
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
        const { nonce, signature, payload }: Request<{ [pk: string]: Backup }> = JSON.parse(request);
        if (!verify(nonce, await this.getIdentity(ctx, id), signature)) {
            throw new Error('Verification failed');
        }
        await ctx.backup.set(id, JSON.stringify(payload[this.pre.serialize(this.pk)]));
    }

    async verifyEmail(ctx: PreDAuthContext, id: string, request: string) {
        const { payload }: Request<{ email: string; }> = JSON.parse(request);
        const backup = await ctx.backup.get(id);
        if (!backup.length) {
            // if current node does not have rk and email of `id`, just alter the state of ledger
            await ctx.recovery.set([id], 'true');
            return;
        }
        const { email } = JSON.parse(backup);
        if (payload.email !== email) {
            throw new Error('Verification failed');
        }
        const code = randomCode();
        await ctx.code.set(id, JSON.stringify({ code, time: Date.now() }));
        await ctx.recovery.set([id], 'true');
        await mailto({ from: 'PreDAuth', to: email, subject: 'Verification Code', text: code });
    }

    async recover(ctx: PreDAuthContext, id: string, request: string) {
        const { payload }: Request<{ codes: string[]; }> = JSON.parse(request);
        const backup = await ctx.backup.get(id);
        if (!backup.length) {
            // if current node does not have rk and email of `id`, just return empty data
            JSON.stringify({ data: {} });
        }
        const { code, time } = JSON.parse(await ctx.code.get(id));
        if (!payload.codes.includes(code) || Date.now() - time > 1000 * 60 * 10) {
            throw new Error('Verification failed');
        }
        await ctx.code.del(id);
        const { rk } = JSON.parse(backup);
        const encrypted: Data = JSON.parse(await this.getData(ctx, id));
        const reEncrypted = this.handleReEncrypt(encrypted, rk);
        return JSON.stringify({ // TODO: encrypt decrypted data using user's new publicKey
            data: Object.fromEntries(Object.entries(reEncrypted).map(([tag, { data, key, iv }]) =>
                [tag, this.handleReDecrypt(data, key, iv)]
            ))
        });
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

