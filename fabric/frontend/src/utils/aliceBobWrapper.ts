import { TaggedEncrypted, TaggedPreKeyPair, TaggedReEncrypted, TaggedUserDataArray, UserDataArray } from '../constants/types';

import { Alice } from './alice';
import { Bob } from './bob';

export const encrypt = async (aliceInstance: Alice, data: TaggedUserDataArray) => {
    const encrypted: TaggedEncrypted = {};
    const dataKey: TaggedPreKeyPair = {};
    await Promise.all(data.map(async ([tag, kv]) => {
        const { pk, sk } = aliceInstance.key();
        dataKey[tag] = { pk, sk };
        encrypted[tag] = await aliceInstance.encrypt(JSON.stringify(kv), pk);
    }));
    return { encrypted, dataKey };
};

export const decrypt = async (aliceInstance: Alice, data: TaggedEncrypted, dataKey: TaggedPreKeyPair) => {
    const decrypted: UserDataArray = [];
    await Promise.all(Object.entries(data).map(async ([tag, encrypted]) => {
        Object.entries<string>(JSON.parse(await aliceInstance.decrypt(encrypted, dataKey[tag].sk))).forEach(([key, value]) => {
            decrypted.push({ key, value, tag });
        });
    }));
    return decrypted;
};

export const reDecrypt = async (bobInstance: Bob, data: TaggedReEncrypted) => {
    const decrypted: UserDataArray = [];
    await Promise.all(Object.entries(data).map(async ([tag, encrypted]) => {
        Object.entries<string>(JSON.parse(await bobInstance.reDecrypt(encrypted))).forEach(([key, value]) => {
            decrypted.push({ key, value, tag });
        });
    }));
    return decrypted;
};
