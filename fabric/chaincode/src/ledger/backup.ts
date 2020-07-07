import { Context } from 'fabric-contract-api';
import { PrivateLedger } from './private';

export class BackupLedger extends PrivateLedger {
    constructor(ctx: Context) {
        super(ctx, 'backupLedger');
    }
}
