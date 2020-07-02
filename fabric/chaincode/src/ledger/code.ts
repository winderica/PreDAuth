import { Context } from 'fabric-contract-api';
import { StateLedger } from './state';

export class CodeLedger extends StateLedger {
    constructor(ctx: Context) {
        super(ctx, 'codeLedger');
    }
}
