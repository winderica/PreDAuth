import { Context } from 'fabric-contract-api';
import { PrivateLedger } from './private';

export class BackupLedger extends PrivateLedger {
    constructor(ctx: Context) {
        /* eslint-disable */
        super(ctx, `backupLedger_${(ctx.stub as any).getMspID()}`);
        /* eslint-enable */
    }
}
