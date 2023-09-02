const vm = require('vm');

const templateCache = {};

const templateContext = vm.createContext({
    _(value) {
        if (!value) return '';
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&#39;')
            .replace(/"/g, '&quot;');
    },
    include(name, data) {
        const template = templateCache[name] || templateFactory(name);
        return template(data);
    }
});

function templateFactory(name, templateContent) {
    templateCache[name] = vm.runInNewContext(`(function (data) {
        with(data) {
            return \`${templateContent}\`
        }
    })`, templateContext);
    return templateCache[name];
}

module.exports = templateFactory;
