const RPC = require('./rpc');

const packageHeaderLength = 8,
    seqLength = 4;

module.exports = {
    RPC: (encodeSchema, decodeSchema) => {
        return new RPC({
            encode(data, seq) {
                const body = encodeSchema.encode(data);
                const bodyLength = body.length;
                const header = Buffer.alloc(packageHeaderLength);
                header.writeInt32BE(seq);
                header.writeInt32BE(bodyLength, seqLength);
                return Buffer.concat([header, body]);
            },
            decode(buffer) {
                const seq = buffer.readInt32BE();
                const body = buffer.slice(packageHeaderLength);
                const result = decodeSchema.decode(body);
                return {
                    seq,
                    result
                };
            },
            isReceiveComplete(buffer) {
                const bufferLength = buffer.length;
                if (bufferLength <= packageHeaderLength)
                    return 0;
                const bodyLength = buffer.readInt32BE(seqLength);
                if (bufferLength >= bodyLength + packageHeaderLength)
                    return bodyLength + packageHeaderLength;
                else
                    return 0;
            }
        });
    }
};