import { TaggedEncrypted, TaggedPreKeyPair, TaggedReEncrypted, TaggedUserDataArray, UserDataArray } from '../constants/types';

import { Alice } from './alice';
import { Bob } from './bob';

export const encrypt = async (aliceInstance: Alice, data: TaggedUserDataArray, dataKey = getDataKey(aliceInstance, data.map(([tag]) => tag))) => {
    const encrypted: TaggedEncrypted = {};
    await Promise.all(data.map(async ([tag, kv]) => {
        encrypted[tag] = await aliceInstance.encrypt(JSON.stringify(kv), dataKey[tag].pk);
    }));
    return { encrypted, dataKey };
};

export const getDataKey = (aliceInstance: Alice, tags: string[]) => {
    return Object.fromEntries(tags.map((tag) => [tag, aliceInstance.key()]));
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
    return Object.fromEntries(
        await Promise.all(
            Object.entries(data).map(async ([tag, encrypted]) =>
                [tag, JSON.parse(await bobInstance.reDecrypt(encrypted))] as TaggedUserDataArray[0]
            )
        )
    );
};
