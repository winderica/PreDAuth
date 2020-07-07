import { Alice, Encrypted, PreKeyPair } from './alice';

export const encrypt = async (aliceInstance: Alice, data: [string, Record<string, string>][]) => {
    const encrypted: Record<string, Encrypted> = {};
    const dataKey: Record<string, PreKeyPair> = {};
    await Promise.all(data.map(async ([tag, kv]) => {
        const { pk, sk } = aliceInstance.key();
        dataKey[tag] = { pk, sk };
        encrypted[tag] = await aliceInstance.encrypt(JSON.stringify(kv), pk);
    }));
    return { encrypted, dataKey };
};

export const decrypt = async (aliceInstance: Alice, data: Record<string, Encrypted>, dataKey: Record<string, PreKeyPair>) => {
    const decrypted: { key: string; value: string; tag: string; }[] = [];
    await Promise.all(Object.entries(data).map(async ([tag, encrypted]) => {
        Object.entries<string>(JSON.parse(await aliceInstance.decrypt(encrypted, dataKey[tag].sk))).forEach(([key, value]) => {
            decrypted.push({ key, value, tag });
        });
    }));
    return decrypted;
};
