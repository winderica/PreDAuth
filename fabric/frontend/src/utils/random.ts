export const random = (length: number) => String.fromCharCode(...new Uint8Array(crypto.getRandomValues(new Uint8Array(length))));
