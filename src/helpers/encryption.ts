const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const baseKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            // @ts-ignore
            salt,
            iterations: 100_000,
            hash: "SHA-256"
        },
        baseKey,
        {
            name: "AES-GCM",
            length: 256
        },
        false,
        ["encrypt", "decrypt"]
    )
}

export async function encrypt(password: string, plaintextData: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await deriveKey(password, salt);

    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        key,
        encoder.encode(plaintextData)
    );

    return JSON.stringify([
        bufferToBase64(encryptedData),
        bufferToBase64(iv),
        bufferToBase64(salt)
    ]);
}

export async function decrypt(password: string, cipherText: string): Promise<string> {
    const [encryptedData, iv, salt] = JSON.parse(cipherText) as [string, string, string];
    
    const key = await deriveKey(
        password,
        new Uint8Array(base64ToBuffer(salt))
    );

    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: new Uint8Array(base64ToBuffer(iv)),
        },
        key,
        base64ToBuffer(encryptedData)
    );

    return decoder.decode(decryptedData);
}