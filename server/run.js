const koa = require('koa');
const koaMount = require('koa-mount');

const factory = require('./factory');
const templateFactory = require('./templateFactory');

const PORT = 3000;

const server = (totalConfig) => {
    const app = new koa();
    app.use(koaMount('/favicon.ico', ctx => {
        const {response} = ctx;
        response.status = 200;
        response.body = '';
        return true;
    }));

    Object.entries(totalConfig).map(([path, dataConfig]) => {
        const {name, content} = dataConfig.template;
        dataConfig = eval(dataConfig.data);
        const requests = Object
            .entries(dataConfig)
            .reduce((ret, [key, config]) => {
                const protocol = config.protocol;
                factory.registerProtocol(protocol);
                ret[key] = factory(config);
                return ret;
            }, {});
        const template = templateFactory(name, content);
        app.use(koaMount(path, async (ctx) => {
            const {request: {query}, response} = ctx;
            response.status = 200;
            const result = {};
            await Promise.all(Object.entries(requests).map(([key, data]) => {
                return data(query).then(res => {
                    result[key] = res.result;
                });
            }));
            try {
                response.body = template(result);
            } catch (e) {
                response.status = 500;
                response.body = e.stack;
            }
        }));
    });

    app.listen(PORT, () => {
        console.log(`The client page is running at http://127.0.0.1:${PORT}/!`);
    });
};

module.exports = server;