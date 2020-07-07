import { Context } from 'fabric-contract-api';
import { PrivateLedger } from './private';

export class CodeLedger extends PrivateLedger {
    constructor(ctx: Context) {
        /* eslint-disable */
        super(ctx, `codeLedger_${(ctx.stub as any).getMspID()}`);
        /* eslint-enable */
    }
}
