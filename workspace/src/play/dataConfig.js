module.exports = {
    detail: {
        protocol: 'rpc',
        ip: '127.0.0.1',
        port: 4000,
        protoFile: require('./proto/detail.proto'),
        requestSchemaConstruct: 'DetailRequest',
        responseSchemaConstruct: 'DetailResponse',
        then(data) {
            return data.detail;
        }
    },
    article: {
        protocol: 'http',
        url: 'http://127.0.0.1:4003',
        before(data) {
            return data;
        },
        then(data) {
            return JSON.parse(data).data.list;
        },
        catch() {
        }
    }
};