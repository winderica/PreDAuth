import { Context } from 'fabric-contract-api';

export abstract class StateLedger {
    protected constructor(
        private readonly ctx: Context,
        private readonly name: string,
    ) {
    }

    async set(attributes: string[], state: string) {
        await this.ctx.stub.putState(
            this.ctx.stub.createCompositeKey(this.name, attributes),
            Buffer.from(state)
        );
    }

    async get(attributes: string[]) {
        const data = await this.ctx.stub.getState(this.ctx.stub.createCompositeKey(this.name, attributes));
        return Buffer.from(data).toString('utf8');
    }

    async del(attributes: string[]) {
        await this.ctx.stub.deleteState(this.ctx.stub.createCompositeKey(this.name, attributes));
    }
}
