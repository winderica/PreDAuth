import { createPublicKey, createVerify } from 'crypto';

const curveInfo = {
    'P-256': {
        internalName: 'prime256v1',
        basePointOrderSize: 32
    },
    'P-384': {
        internalName: 'secp384r1',
        basePointOrderSize: 48
    },
    'P-521': {
        internalName: 'secp521r1',
        basePointOrderSize: 66
    }
};

const bZero = Buffer.from([0x00]);
const bTagInteger = Buffer.from([0x02]);
const bTagSequence = Buffer.from([0x30]);

class Asn1SequenceEncoder {
    length = 0;
    elements: Buffer[] = [];

    encodeLength(len: number) {
        if (len < 128)
            return Buffer.from([len]);

        const buffer = Buffer.alloc(5);
        buffer.writeUInt32BE(len, 1);
        let offset = 1;
        while (buffer[offset] === 0) {
            offset++;
        }
        buffer[offset - 1] = 0x80 | (5 - offset);
        return buffer.slice(offset - 1);
    }

    unsignedInteger(integer: Buffer) {
        if (integer[0] & 0x80) {
            const len = this.encodeLength(integer.length + 1);
            this.elements.push(
                bTagInteger,
                len,
                bZero,
                integer
            );
            this.length += 2 + len.length + integer.length;
        } else {
            let i = 0;
            while (integer[i] === 0 && (integer[i + 1] & 0x80) === 0) {
                i++;
            }

            const len = this.encodeLength(integer.length - i);
            this.elements.push(
                bTagInteger,
                this.encodeLength(integer.length - i),
                integer.slice(i)
            );
            this.length += 1 + len.length + integer.length - i;
        }
    }

    end() {
        const len = this.encodeLength(this.length);
        return Buffer.concat([bTagSequence, len, ...this.elements], 1 + len.length + this.length);
    }
}

function convertSignatureToASN1(signature: Buffer, n: number) {
    const r = signature.slice(0, n);
    const s = signature.slice(n);
    const enc = new Asn1SequenceEncoder();
    enc.unsignedInteger(r);
    enc.unsignedInteger(s);
    return enc.end();
}

export const verify = (message: string, publicKey: string, signature: string) => {
    const pk = createPublicKey({
        key: Buffer.from(publicKey, 'base64'),
        format: 'der',
        type: 'spki'
    });
    const sig = convertSignatureToASN1(Buffer.from(signature, 'base64'), curveInfo['P-521'].basePointOrderSize);
    const verifier = createVerify('SHA512');
    verifier.update(message, 'utf8');
    verifier.end();
    return verifier.verify(pk, sig);
};
