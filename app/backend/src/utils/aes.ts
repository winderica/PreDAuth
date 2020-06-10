import crypto, { BinaryLike, CipherKey, HexBase64BinaryEncoding, Utf8AsciiBinaryEncoding } from 'crypto';

export class AES {
    constructor(
        private readonly _key: CipherKey,
        private readonly _iv: BinaryLike = crypto.randomBytes(16),
        private readonly _algorithm: string = 'aes-256-cbc'
    ) {
    }

    get iv() {
        return this._iv;
    }

    encrypt(message: string, messageEncoding: Utf8AsciiBinaryEncoding = 'utf8', cipherEncoding: HexBase64BinaryEncoding = 'base64') {
        const cipher = crypto.createCipheriv(this._algorithm, this._key, this._iv);

        return cipher.update(message, messageEncoding, cipherEncoding) + cipher.final(cipherEncoding);
    }

    decrypt(encrypted: string, cipherEncoding: HexBase64BinaryEncoding = 'base64', messageEncoding: Utf8AsciiBinaryEncoding = 'utf8') {
        const decipher = crypto.createDecipheriv(this._algorithm, this._key, this._iv);

        return decipher.update(encrypted, cipherEncoding, messageEncoding) + decipher.final(messageEncoding);
    }
}
