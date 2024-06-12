const fetch = require('node-fetch');

// Vault server URL and Transit engine mount path
const vault_addr = process.env.VAULT_ADDR || "http://localhost:8200";
const vault_token = process.env.VAULT_TOKEN || "";
const vault_path = process.env.VAULT_TRANSIT_MOUNT || "transit";
const vault_transit_key = process.env.VAULT_TRANSIT_KEY || "chat-key";
// Encryption endpoint
const encryptEndpoint = `${vault_addr}/v1/${vault_path}/encrypt/${vault_transit_key}`;

// Decryption endpoint
const decryptEndpoint = `${vault_addr}/v1/${vault_path}/decrypt/${vault_transit_key}`;

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
  'X-Vault-Token': vault_token,
  'Content-Type': 'application/json'
};

// Function to encrypt data
module.exports.encryptData = async function (plaintext) {
  try {
    const response = await fetch(encryptEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ "plaintext": base64Encode(plaintext) })
    })

    let resp_body = await response.json()
    return resp_body.data.ciphertext
  } catch (error) {
    console.error('Error encrypting data:', error);
  }
}

// Function to decrypt data
module.exports.decryptData = async function (ciphertext) {
  try {
    const response = await fetch(decryptEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ "ciphertext": ciphertext })
    });

    let resp_body = await response.json()
    return base64Decode(resp_body.data.plaintext)
  } catch (error) {
    console.error('Error decrypting data:', error);
    return error
  }
}