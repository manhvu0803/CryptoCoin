const SHA256 = require("crypto-js/sha256");
const fs = require("fs");

class Block {
    constructor(index, timestamp, data, previousHash, nonce) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = nonce;
        this.hash = this.getHash();
    }

    getDifficulty() {
        let index = 0;

        while (this.hash.length > index && this.hash[index] == "0") {
            index++;
        }

        return index;
    }

    getHash() {
        return SHA256(this.index + this.timestamp + this.nonce + this.previousHash + JSON.stringify(this.data)).toString()
    }
}

function validateChainIntegrity(blockchain) {
    for (let i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const previousBlock = blockchain[i - 1];

        if (currentBlock.hash !== currentBlock.getHash()) {
            return false;
        }

        if (currentBlock.previousHash !== previousBlock.hash) {
            return false;
        }

        return true;
    }
}

const chain = [];

function createBlock(data, difficulty) {
    let previousHash = (chain.length > 0) ? chain[chain.length - 1].hash : "0";
    let block = new Block(chain.length, Date.now(), data, previousHash, 0);
    let nonce = 0;

    while (difficulty > block.getDifficulty()) {
        nonce++;
        block = new Block(chain.length, Date.now(), data, previousHash, nonce);
    }
}

function addBlock(block) {
    if (chain.length > 0 && block.previousHash <= chain[chain.length - 1].hash) {
        return false;
    }

    chain.push(block);
    fs.writeFile("blockchain.json", JSON.stringify(block, null, 4), (err) => console.log(err));
    return true;
}

module.exports = {
    createBlock,
    addBlock,
    validateChainIntegrity,
    chain
}