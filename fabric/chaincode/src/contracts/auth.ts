import { Context, Contract } from 'fabric-contract-api';

export class PreDAuth extends Contract {
    saveData(ctx: Context) {
        console.log(ctx.clientIdentity.getAttributeValue('hf.EnrollmentID'));
        // await ctx.stub.putState(address, Buffer.from(JSON.stringify({ key: encryptedAESKey, data: encryptedData })));
    }

}

