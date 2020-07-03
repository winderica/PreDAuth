export const random = (length) => String.fromCharCode(...new Uint8Array(crypto.getRandomValues(new Uint8Array(length))));
