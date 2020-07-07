import { Context } from 'fabric-contract-api';

export abstract class PrivateLedger {
    protected constructor(
        private readonly ctx: Context,
        private readonly name: string,
    ) {
    }

    async set(id: string, state: string) {
        await this.ctx.stub.putPrivateData(
            this.name,
            id,
            Buffer.from(state)
        );
    }

    async get(id: string) {
        const data = await this.ctx.stub.getPrivateData(this.name, id);
        return Buffer.from(data).toString('utf8');
    }

    async del(id: string) {
        await this.ctx.stub.deletePrivateData(this.name, id);
    }
}
