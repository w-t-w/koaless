const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const mkdirp = require('mkdirp');
const MFS = require('memory-fs');

const BUSINESS_PATH = path.resolve(process.cwd(), './config');
const mfs = new MFS();

function uploader(configName, dataConfigPath, templateConfigPath) {
    mkdirp.sync(`${BUSINESS_PATH}/${configName}`);
    fs.createReadStream(templateConfigPath).pipe(fs.createWriteStream(path.resolve(BUSINESS_PATH, configName, 'template.tpl')));
    const compileTask = webpack({
        devtool: false,
        mode: 'development',
        target: 'node',
        entry: {
            dataConfig: dataConfigPath
        },
        output: {
            publicPath: '',
            path: '/zone',
            filename: '[name].js',
            chunkFilename: '[name].js',
            library: {
                type: 'umd'
            }
        },
        module: {
            rules: [{
                test: /\.proto$/,
                use: [{
                    loader: 'text-loader'
                }]
            }]
        }
    });
    compileTask.outputFileSystem = mfs;
    compileTask.run(error => {
        if (error) return false;
        const content = mfs.readFileSync('/zone/dataConfig.js');
        fs.writeFileSync(path.resolve(BUSINESS_PATH, configName, 'dataConfig.js'), content, 'utf-8');
    });
}

module.exports = {
    uploader
};