const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
};

export const generateKey = () => crypto.subtle.generateKey(
    {
        name: 'ECDSA',
        namedCurve: 'P-521',
    },
    false,
    ['sign', 'verify'],
);

export const exportPublicKey = async ({ publicKey }: CryptoKeyPair) => arrayBufferToBase64(
    await crypto.subtle.exportKey('spki', publicKey)
);

export const sign = async (message: string, { privateKey }: CryptoKeyPair) => arrayBufferToBase64(
    await crypto.subtle.sign(
        {
            name: 'ECDSA',
            hash: { name: 'SHA-512' },
        },
        privateKey,
        new TextEncoder().encode(message)
    )
);

