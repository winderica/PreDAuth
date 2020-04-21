import * as crypto from "crypto";
import { BinaryLike, CipherKey, HexBase64BinaryEncoding, Utf8AsciiBinaryEncoding } from "crypto";

export class AES {
    algorithm: string;
    key: CipherKey;
    iv: BinaryLike;

    constructor(key: CipherKey, iv: BinaryLike, algorithm = 'aes-256-cbc') {
        this.algorithm = algorithm;
        this.key = key;
        this.iv = iv;
    }

    encrypt(message: string, messageEncoding: Utf8AsciiBinaryEncoding = 'utf8', cipherEncoding: HexBase64BinaryEncoding = 'base64') {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        cipher.setAutoPadding(true);

        return cipher.update(message, messageEncoding, cipherEncoding) + cipher.final(cipherEncoding);
    }

    decrypt(encrypted: string, cipherEncoding: HexBase64BinaryEncoding = 'base64', messageEncoding: Utf8AsciiBinaryEncoding = 'utf8') {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        decipher.setAutoPadding(true);

        return decipher.update(encrypted, cipherEncoding, messageEncoding) + decipher.final(messageEncoding);
    }
}
