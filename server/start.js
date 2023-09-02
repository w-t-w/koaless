const fs = require('fs');
const path = require('path');
const run = require('./run');

const DATA_CONFIG_DIR = path.resolve(process.cwd(), './config/play/dataConfig.js');
const TEMPLATE_CONFIG_DIR = path.resolve(process.cwd(), './config/play/template.tpl');

(async function () {
    const data = await new Promise((resolve, reject) => {
        // fs.readFile(DATA_CONFIG_DIR, 'utf-8', (err, data) => {
        //     err ? reject(err) : resolve(data);
        // });
        resolve(require(DATA_CONFIG_DIR));
    });

    const template = {};
    template.name = TEMPLATE_CONFIG_DIR;
    template.content = await new Promise((resolve, reject) => {
        fs.readFile(TEMPLATE_CONFIG_DIR, 'utf-8', (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });

    run({
        '/play': {
            data,
            template
        }
    });
})();