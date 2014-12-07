'use strict';

var nodecg = {};

function Filter(extensionApi) {
    if (Filter.prototype._singletonInstance) {
        return Filter.prototype._singletonInstance;
    }
    Filter.prototype._singletonInstance = this;

    nodecg = extensionApi;
    this.wordfilter = require('./extension/wordfilter')(nodecg);
    this.emailfilter = require('./extension/emailfilter')(nodecg);
}

module.exports = function(extensionApi) { return new Filter(extensionApi) };
