import { Context } from 'fabric-contract-api';

export class PrivateLedger {
    readonly #ctx: Context;

    constructor(ctx: Context) {
        this.#ctx = ctx;
    }

    private name() {
        // https://github.com/hyperledger/fabric-chaincode-node/pull/185
        return '_implicit_org_' + (this.#ctx.stub as unknown as { getMspID: () => string; }).getMspID();
    }

    async set(id: string, state: string) {
        await this.#ctx.stub.putPrivateData(
            this.name(),
            id,
            Buffer.from(state)
        );
    }

    async get(id: string) {
        const data = await this.#ctx.stub.getPrivateData(this.name(), id);
        return Buffer.from(data).toString('utf8');
    }

    async del(id: string) {
        await this.#ctx.stub.deletePrivateData(this.name(), id);
    }
}
