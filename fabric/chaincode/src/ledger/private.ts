import { Context } from 'fabric-contract-api';

export abstract class PrivateLedger {
    protected constructor(
        private readonly ctx: Context,
        private name: string,
    ) {
    }

    async set(msp: string, id: string, state: string) {
        await this.ctx.stub.putPrivateData(
            this.name + '_' + msp,
            id,
            Buffer.from(state)
        );
    }

    async get(msp: string, id: string) {
        const data = await this.ctx.stub.getPrivateData(this.name + '_' + msp, id);
        return Buffer.from(data).toString('utf8');
    }

    async del(msp: string, id: string) {
        await this.ctx.stub.deletePrivateData(this.name + '_' + msp, id);
    }
}
