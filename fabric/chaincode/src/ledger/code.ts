import { Context } from 'fabric-contract-api';
import { PrivateLedger } from './private';

export class CodeLedger extends PrivateLedger {
    constructor(ctx: Context) {
        super(ctx, 'codeLedger');
    }
}
