const dgram = require('node:dgram');
const blockchain = require("./blockchain");
const client = require("./client");

const server = dgram.createSocket('udp4');
const udpPort = 41234;

const nodes = [];

function send(messageType, receiver, data) {
    server.send(JSON.stringify({
        type: messageType,
        from: client.publicKey,
        to: receiver,
        data: data
    }), udpPort)
}

server.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    msg = JSON.parse(msg);
    console.log(`server got ${msg.type} from ${rinfo.address}:${rinfo.port}`);

    if (msg.type == "hello") {
        send("re-hello", msg.from);
    }
    else if (msg.type == "re-hello" && msg.to == client.publicKey) {
        nodes.push(msg.from);
    }
    else if (msg.type == "blockchain" && msg.to == client.publicKey) {
        send("re-blockchain", msg.from, blockchain.chain);
    }
    else if (msg.type == "re-blockchain") {
        if (!blockchain.validateChainIntegrity(msg.data)) {
            send("re-re-blockchain", msg.from, false);
        }
    }
    else if (msg.type == "re-re-blockchain" && msg.to == client.publicKey && msg.data === false) {
        console.log("Error: chain is invalid");
    }
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(udpPort);