'use strict';

function Filter(nodecg) {
    this.wordfilter = require('./extension/wordfilter')(nodecg);
    this.emailfilter = require('./extension/emailfilter')(nodecg);
}

module.exports = function(nodecg) { return new Filter(nodecg) };
