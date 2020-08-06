export const hexToUint8Array = (str: string) => {
    return new Uint8Array(str.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) ?? []);
};

export const uint8ArrayToHex = (arr: Uint8Array) => {
    return arr.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
};

export const base64ToUint8Array = (str: string) => {
    return Uint8Array.from([...atob(str)].map(i => i.charCodeAt(0)));
};

export const uint8ArrayToBase64 = (arr: Uint8Array) => {
    return btoa(String.fromCharCode(...arr));
};
