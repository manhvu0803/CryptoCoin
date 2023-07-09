const crypto = require('crypto');
const fs = require("fs");

class Output {
    constructor(block) {
        this.block = block;
        this.owner = block.data.to;
        this.amount = block.data.amount;
    }
}

var unspentBlocks = [];

var privateKey, publicKey;

function generateKeyPair(passphrase) {
    privateKey, publicKey = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            passphrase: passphrase
        }
    });

    fs.writeFile("publickey.dat", publicKey);
    fs.writeFile("privatekey.dat", privateKey);
}

function addCoin(block) {
    unspentBlocks.push(new Output(block));
}

function spend(amount) {
    let total = 0;
    let blocks = [];

    for (let i = 0; i < unspentBlocks.length; ++i) {
        total += unspentBlocks[i].amount;
        blocks.push(unspentBlocks[i].block);

        if (total >= amount) {
            return blocks;
        }
    }

    return null;
}

module.exports = {
    addCoin,
    spend,
    generateKeyPair,
    privateKey,
    publicKey
}