import { Context, Contract } from 'fabric-contract-api';
import { G1, G2, PRE } from '../utils/pre';

export class PreDAuth extends Contract {
    pre!: PRE;
    g!: G1;
    h!: G2;

    async init(_: Context, str1: string, str2: string) {
        this.pre = new PRE();
        await this.pre.init();
        const { g, h } = this.pre.generatorGen(str1, str2);
        this.g = g;
        this.h = h;
    }

    async saveData(ctx: Context, id: string, data: string) {
        await ctx.stub.putState(id, Buffer.from(data));
    }

    async getData(ctx: Context, id: string) {
        return Buffer.from(await ctx.stub.getState(id)).toString('utf8');
    }

    async reEncrypt(ctx: Context, id: string, rks: string) {
        const data = JSON.parse(Buffer.from(await ctx.stub.getState(id)).toString('utf8'));
        const tagRK = JSON.parse(rks) as { [tag: string]: string };
        const res = Object.entries(tagRK).map(([tag, rk]) => {
            const { ca0, ca1 } = data[tag].key;
            const { cb0, cb1 } = this.pre.reEncrypt({
                ca0: this.pre.deserialize(ca0, 'Fr'),
                ca1: this.pre.deserialize(ca1, 'G1')
            }, this.pre.deserialize(rk, 'G2'));
            return {
                data: data[tag].data,
                key: {
                    cb0: this.pre.serialize(cb0),
                    cb1: this.pre.serialize(cb1),
                },
                iv: data[tag].iv,
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

