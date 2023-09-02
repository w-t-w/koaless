const requesters = {};

function factory(config) {
    const before = config.before || (data => data);
    const then = config.then || (data => data);
    const catchable = config.catch || (data => data);
    const protocol = config.protocol;
    const requester = requesters[protocol];

    requester.compile(config);

    return async function (data) {
        try {
            data = before(data);
        } catch (e) {
            catchable(e);
            return Promise.resolve(null);
        }
        return {
            result: await requester
                .request(data)
                .then(then)
                .catch(catchable)
        };
    };
}

factory.registerProtocol = (protocol, requester) => {
    if (typeof requester !== 'undefined')
        requesters[protocol] = requester;
    else {
        requesters[protocol] = require(`../requestor/${protocol}`);
    }
};

module.exports = factory;