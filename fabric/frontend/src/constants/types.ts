export interface PreKeyPair {
    pk: string;
    sk: string;
}

export interface Encrypted {
    data: string;
    key: {
        ca0: string;
        ca1: string;
    };
    iv: string;
}

export interface ReEncrypted {
    data: string;
    key: {
        cb0: string;
        cb1: string;
    };
    iv: string;
}
