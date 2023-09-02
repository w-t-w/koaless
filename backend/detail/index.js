const fs = require('fs');
const path = require('path');
const protobuf = require('protocol-buffers');

const {RPC} = require('./lib');
const data = require('./data/column');

const PORT = 4000;

const PROTO_DIR = path.resolve(__dirname, './proto/detail.proto');
const protoFile = fs.readFileSync(PROTO_DIR, 'utf-8');
const schema = protobuf(protoFile);

const rcpServer = RPC(schema.DetailResponse, schema.DetailRequest);

rcpServer.createServer((request, response) => {
    const {body: {column_id = 0}} = request;
    console.log(`columnId => ${column_id}`);
    //...
    response.end({
        detail: data[0],
        recommend_detail: [data[1], data[2], data[3], data[4]]
    });
}).listen(PORT, () => {
    console.log(`The detail interface is running at http://127.0.0.1:${PORT}/!`);
});