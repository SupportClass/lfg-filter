'use strict';

var fs = require('fs');
var util = require('util');
var cheerio = require('cheerio');

module.exports = function (fileLocation, bundle, resourceType) {
    var file = fs.readFileSync(fileLocation);
    var $ = cheerio.load(file);

    // All injections need nodecg-api, duh
    var scripts = [
        '<script src="/components/eventemitter2/lib/eventemitter2.js"></script>',
        '<script src="/stubs/nodecg-api.js"></script>'
    ];

    switch (resourceType) {
        case 'panel':
            scripts.push('<script src="/stubs/dialog_opener.js"></script>');
            break;
        case 'dialog':
            scripts.push('<script src="/stubs/dialog_helper.js"></script>');
            break;
        case 'graphic':
            break;
        default:
            throw new Error('Invalid resourceType "' + resourceType + '"');
    }

    scripts = scripts.join('\n');

    var partialBundle = {
        name: bundle.name,
        config: bundle.config
    };

    scripts = util.format(scripts, JSON.stringify(partialBundle));

    var currentHead = $('head').html();
    $('head').html(scripts + currentHead);
    return $.html();
};
