const request = require('request');

let url = null;
const httpClientConfig = {
    compile: (config) => url = config.url,
    request: (data) => {
        return new Promise((resolve, reject) => {
            request.get(url, {...data}, (err, result, body) => {
                err ? reject(err) : resolve(body);
            });
        });
    }
};

module.exports = httpClientConfig;