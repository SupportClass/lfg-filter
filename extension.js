'use strict';

module.exports = function(nodecg) {
    var filter = {};
    filter.wordfilter = require('./extension/wordfilter')(nodecg);
    filter.emailfilter = require('./extension/emailfilter')(nodecg);
    return filter;
};
