import { Context } from 'fabric-contract-api';
import { StateLedger } from './state';

export class BackupLedger extends StateLedger {
    constructor(ctx: Context) {
        super(ctx, 'backupLedger');
    }
}
