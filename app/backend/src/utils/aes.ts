import crypto, { BinaryLike, CipherKey, HexBase64BinaryEncoding, Utf8AsciiBinaryEncoding } from 'crypto';

export class AES {
    readonly #key: CipherKey;
    readonly #iv: BinaryLike;
    readonly #algorithm: string;

    constructor(key: CipherKey, iv: BinaryLike = crypto.randomBytes(16), algorithm = 'aes-256-cbc') {
        this.#key = key;
        this.#iv = iv;
        this.#algorithm = algorithm;
    }

    get iv() {
        return this.#iv;
    }

    encrypt(message: string, messageEncoding: Utf8AsciiBinaryEncoding = 'utf8', cipherEncoding: HexBase64BinaryEncoding = 'base64') {
        const cipher = crypto.createCipheriv(this.#algorithm, this.#key, this.#iv);
        cipher.setAutoPadding(true);
        return cipher.update(message, messageEncoding, cipherEncoding) + cipher.final(cipherEncoding);
    }

    decrypt(encrypted: string, cipherEncoding: HexBase64BinaryEncoding = 'base64', messageEncoding: Utf8AsciiBinaryEncoding = 'utf8') {
        const decipher = crypto.createDecipheriv(this.#algorithm, this.#key, this.#iv);
        decipher.setAutoPadding(true);
        return decipher.update(encrypted, cipherEncoding, messageEncoding) + decipher.final(messageEncoding);
    }
}
