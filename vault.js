const fetch = require('node-fetch');

// Vault server URL and Transit engine mount path
const VAULT_URL = 'http://192.168.0.164:8200';
const TRANSIT_PATH = '/v1/transit';

// Vault token for authentication
const VAULT_TOKEN = 'hvs.latmF1nwYxfDMrDrExyOlxld';

// Encryption endpoint
const encryptEndpoint = `${VAULT_URL}${TRANSIT_PATH}/encrypt/chat-key`;

// Decryption endpoint
const decryptEndpoint = `${VAULT_URL}${TRANSIT_PATH}/decrypt/chat-key`;

// Function to base64 encode data
function base64Encode(data) {
    return Buffer.from(data).toString('base64');
}

// Function to base64 decode data
function base64Decode(data) {
    return Buffer.from(data, 'base64').toString('utf8');
}

// Headers for Vault API requests
const headers = {
    'X-Vault-Token': VAULT_TOKEN,
    'Content-Type': 'application/json'
};

// Function to encrypt data
module.exports.encryptData = async function(plaintext) {
    try {
        const response = await fetch(encryptEndpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({ "plaintext":base64Encode(plaintext) })
        }).then(res => res.json())
        .then((result) => {
            console.log('Encrypted data:', result.data.ciphertext);
         return result.data.ciphertext
        });
    } catch (error) {
        console.error('Error encrypting data:', error);
    }
}

// Function to decrypt data
module.exports.decryptData = async function(ciphertext) {
    try {
        const response = await fetch(decryptEndpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({ "ciphertext":ciphertext })
        }).then(res => res.json())
        .then((result) => {
            let plaintext = base64Decode(result.data.plaintext)
            console.log("decrypted: ", plaintext)
            return plaintext
        });
    } catch (error) {
        console.error('Error decrypting data:', error);
        return error
    }
}

// // Encrypt and then decrypt the data
// encryptData("Test Encrypt").then(response => {
//     // After encryption, you can decrypt the data
//     // Provide the ciphertext received from encryption
//     decryptData(response);
// });
