export interface Request<T> {
    nonce: string;
    signature: string;
    payload: T;
}

export interface PK {
    publicKey: string;
}

export interface Data {
    [tag: string]: {
        key: {
            ca0: string;
            ca1: string;
        };
        data: string;
        iv: string;
    };
}

export interface RK {
    [tag: string]: string;
}

export interface Backup {
    rk: RK;
    email: string;
}

export interface Code {
    code: string;
    time: number;
}
