import axios, { AxiosInstance } from 'axios';
import { random } from '../utils/random';
import { exportPublicKey, sign } from '../utils/ecdsa';
import { Encrypted } from '../utils/alice';

export class ENDPOINT {
    static base = 'https://api.predauth.com:4000';
    static register = (id: string) => `${ENDPOINT.base}/user/${id}`;
    static data = (id: string) => `${ENDPOINT.base}/user/${id}/data`;
    static backup = (id: string) => `${ENDPOINT.base}/user/${id}/backup`;
    static sendCode = (id: string, email: string) => `${ENDPOINT.base}/user/${id}/code/${email}`;
    static recoverByCode = (id: string) => `${ENDPOINT.base}/user/${id}/code`;
    static getGenerators = `${ENDPOINT.base}/auth/generators`;
    static pks = `${ENDPOINT.base}/auth/pks`;
    static reEncrypt = (id: string, redirect: string) => `${ENDPOINT.base}/auth/reEncrypt/${id}/${encodeURIComponent(redirect)}`;
}

interface SuccessResponse<T> {
    ok: true;
    payload: T;
}

interface FailureResponse {
    ok: false;
    payload: {
        message: string;
    }
}

type R<T> = SuccessResponse<T> | FailureResponse;

class API {
    #axios: AxiosInstance;

    constructor() {
        this.#axios = axios.create({
            baseURL: ENDPOINT.base,
        });
    }

    async getGenerators() {
        const { data } = await this.#axios.get<R<{ g: string; h: string; }>>(ENDPOINT.getGenerators);
        if (!data.ok) {
            throw new Error(data.payload.message);
        }
        return data.payload;
    }

    async getData(id: string) {
        const { data } = await this.#axios.get<R<Record<string, Encrypted>>>(ENDPOINT.data(id));
        if (!data.ok) {
            throw new Error(data.payload.message);
        }
        return data.payload;
    }

    async setData(id: string, key: CryptoKeyPair, payload: Record<string, Encrypted>) {
        const nonce = random(32);
        const signature = await sign(nonce, key);
        const { data } = await this.#axios.post<R<undefined>>(ENDPOINT.data(id), {
            nonce,
            signature,
            payload
        });
        if (!data.ok) {
            throw new Error(data.payload.message);
        }
    }

    async reEncrypt(id: string, key: CryptoKeyPair, callback: string, payload: Record<string, string>) {
        const nonce = random(32);
        const signature = await sign(nonce, key);
        const { data } = await this.#axios.post<R<undefined>>(ENDPOINT.reEncrypt(id, callback), {
            nonce,
            signature,
            payload
        });
        if (!data.ok) {
            throw new Error(data.payload.message);
        }
    }

    async getPKs() {
        const { data } = await this.#axios.get<R<{ pks: string[] }>>(ENDPOINT.pks);
        if (!data.ok) {
            throw new Error(data.payload.message);
        }
        return data.payload;
    }

    async backup(id: string, key: CryptoKeyPair, payload: Record<string, { rk: Record<string, string>; email: string; }>) {
        const nonce = random(32);
        const signature = await sign(nonce, key);
        const { data } = await this.#axios.post<R<undefined>>(ENDPOINT.backup(id), {
            nonce,
            signature,
            payload
        });
        if (!data.ok) {
            throw new Error(data.payload.message);
        }
    }

    async sendCode(id: string, email: string) {
        const { data } = await this.#axios.get<R<undefined>>(ENDPOINT.sendCode(id, email));
        if (!data.ok) {
            throw new Error(data.payload.message);
        }
    }

    async recoverByCode(id: string, payload: { codes: string[] }) {
        const { data } = await this.#axios.post<R<{ data: Record<string, string>[] }>>(ENDPOINT.recoverByCode(id), {
            payload
        });
        if (!data.ok) {
            throw new Error(data.payload.message);
        }
        return data.payload;
    }

    async register(id: string, key: CryptoKeyPair) {
        const nonce = random(32);
        const signature = await sign(nonce, key);
        const { data } = await this.#axios.post<R<undefined>>(ENDPOINT.register(id), {
            nonce,
            signature,
            payload: {
                publicKey: await exportPublicKey(key)
            }
        });
        if (!data.ok) {
            throw new Error(data.payload.message);
        }
    }
}

export const api = new API();
