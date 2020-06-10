import { Context } from 'fabric-contract-api';
import { StateLedger } from './state';

export class DataLedger extends StateLedger {
    constructor(ctx: Context) {
        super(ctx, 'dataLedger');
    }
}
