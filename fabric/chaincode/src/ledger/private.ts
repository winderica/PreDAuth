import { Context } from 'fabric-contract-api';

const msp2name = (msp: string) => {
    return '_implicit_org_' + msp;
};

export class PrivateLedger {
    readonly #ctx: Context;

    constructor(ctx: Context) {
        this.#ctx = ctx;
    }

    async set(msp: string, id: string, state: string) {
        await this.#ctx.stub.putPrivateData(
            msp2name(msp),
            id,
            Buffer.from(state)
        );
    }

    async get(msp: string, id: string) {
        const data = await this.#ctx.stub.getPrivateData(msp2name(msp), id);
        return Buffer.from(data).toString('utf8');
    }

    async del(msp: string, id: string) {
        await this.#ctx.stub.deletePrivateData(msp2name(msp), id);
    }
}
