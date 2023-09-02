const EasySock = require('easy_sock');
const fs = require('fs');
const protobuf = require('protocol-buffers');

const packageHeaderLength = 8,
    seqLength = 4;

let client = null;

const rpcClientConfig = {
    compile(config) {
        const {ip, port, protoFile, requestSchemaConstruct, responseSchemaConstruct} = config;
        const schema = protobuf(protoFile),
            requestSchema = schema[requestSchemaConstruct],
            responseSchema = schema[responseSchemaConstruct];

        client = new EasySock({
            ip,
            port,
            timeout: 500,
            keepAlive: true
        });
        client.encode = (data, seq) => {
            const body = requestSchema.encode(data);
            const bodyLength = body.length;
            const header = Buffer.alloc(packageHeaderLength);
            header.writeInt32BE(seq);
            header.writeInt32BE(bodyLength, seqLength);
            return Buffer.concat([header, body]);
        };
        client.decode = (buffer) => {
            const seq = buffer.readInt32BE();
            const body = buffer.slice(packageHeaderLength);
            const result = responseSchema.decode(body);
            return {
                seq,
                result
            };
        };
        client.isReceiveComplete = (buffer) => {
            if (buffer.length <= packageHeaderLength)
                return 0;
            const bodyLength = buffer.readInt32BE(seqLength);
            if (buffer.length >= bodyLength + packageHeaderLength)
                return bodyLength + packageHeaderLength;
            else
                return 0;
        };
    },
    request(data) {
        return new Promise((resolve, reject) => {
            client.write({...data}, (err, result) => {
                err ? reject(err) : resolve(result);
            });
        });
    }
};

module.exports = rpcClientConfig;