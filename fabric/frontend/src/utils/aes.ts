import { base64ToUint8Array, hexToUint8Array, uint8ArrayToBase64, uint8ArrayToHex } from './codec';

export class AES {
    readonly #key: PromiseLike<CryptoKey>;
    readonly #iv: Uint8Array;
    readonly #algorithm: string;

    constructor(key: string, iv?: string, algorithm = 'AES-CBC') {
        this.#key = crypto.subtle.importKey(
            'raw',
            hexToUint8Array(key),
            {
                name: algorithm,
            },
            false,
            ['encrypt', 'decrypt']
        );
        this.#iv = iv ? hexToUint8Array(iv): crypto.getRandomValues(new Uint8Array(16));
        this.#algorithm = algorithm;
    }

    get iv() {
        return uint8ArrayToHex(this.#iv);
    }

    // produce base64 encoded data
    async encrypt(plaintext: string) {
        return uint8ArrayToBase64(new Uint8Array(
            await crypto.subtle.encrypt(
                {
                    name: 'AES-CBC',
                    iv: this.#iv
                },
                await this.#key,
                new TextEncoder().encode(plaintext)
            ))
        );
    }

    async decrypt(encrypted: string) {
        return new TextDecoder().decode(await crypto.subtle.decrypt(
            {
                name: 'AES-CBC',
                iv: this.#iv,
            },
            await this.#key,
            base64ToUint8Array(encrypted)
        ));
    }
}
