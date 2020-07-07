import { Context } from 'fabric-contract-api';
import { StateLedger } from './state';

export class RecoveryLedger extends StateLedger {
    constructor(ctx: Context) {
        super(ctx, 'recoveryLedger');
    }
}
