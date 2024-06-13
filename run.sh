#!/bin/bash
npm install

export HTTP_PORT=3000
export ROOT_PATH=/chat
export MONGODB_SERVER=localhost
export MONGODB_PORT=27017
export MONGODB_USERNAME=chat
export MONGODB_PASSWORD=password
# export HTTP_TLS=true
# export PRIVATE_KEY_PATH=private-key.pem
# export PUBLIC_CERT_PATH=public-cert.pem
# export HTTPS_PORT=9443
# export USE_VAULT=true
# export VAULT_ADDR=http://localhost:8200
# export VAULT_TOKEN=""
# export VAULT_TRANSIT_MOUNT="transit"
# export VAULT_TRANSIT_KEY="chat-key"

npm start