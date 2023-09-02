const http = require('http');

const data = require('./data');

const PORT = 4003;

const server = http.createServer((req, res) => {
    res.writeHead(200, {contentType: 'application/json'});
    res.end(JSON.stringify(data));
});

server.listen(PORT, () => {
    console.log(`The article interface is running at http://127.0.0.1:${PORT}/!`);
});