const decoder = new TextDecoder();

export const bytesToString = (bytes: Uint8Array) => decoder.decode(bytes);
