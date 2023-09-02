const net = require('net');

class RPC {
    constructor({encode, decode, isReceiveComplete}) {
        this.encode = encode;
        this.decode = decode;
        this.isReceiveComplete = isReceiveComplete;
    }

    createServer(callback) {
        let buffer = null,
            packageLength = null,
            packageRequest = null;
        const tcpServer = net.createServer(socket => {
            socket.on('data', data => {
                buffer = buffer && buffer.length ? Buffer.concat([buffer, data]) : data;
                while (buffer && (packageLength = this.isReceiveComplete(buffer))) {
                    if (buffer.length === packageLength) {
                        packageRequest = buffer;
                        buffer = null;
                    } else {
                        packageRequest = buffer.slice(0, packageLength);
                        buffer = buffer.slice(packageLength);
                    }
                    const {seq, result} = this.decode(packageRequest);
                    callback({
                        body: result,
                        socket
                    }, {
                        end: (data) => {
                            const buffer = this.encode(data, seq);
                            socket.write(buffer);
                        }
                    });
                }
            });
        });
        return {
            listen(...args) {
                tcpServer.listen.apply(tcpServer, args);
            }
        }
    }
}

module.exports = RPC;