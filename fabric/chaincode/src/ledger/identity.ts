import { Context } from 'fabric-contract-api';
import { StateLedger } from './state';

export class IdentityLedger extends StateLedger {
    constructor(ctx: Context) {
        super(ctx, 'identityLedger');
    }
}
