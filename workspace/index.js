const path = require('path');

const {uploader} = require('./build');

uploader(
    'play',
    './workspace/src/play/dataConfig.js',
    path.resolve(process.cwd(), './workspace/src/play/template.html')
);