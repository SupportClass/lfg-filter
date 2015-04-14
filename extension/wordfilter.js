'use strict';
// Exports an wordfilter singleton

var nodecg = {};
var wordBlacklist;

function Wordfilter(extensionApi) {
    if (Wordfilter.prototype._singletonInstance) {
        return Wordfilter.prototype._singletonInstance;
    }
    Wordfilter.prototype._singletonInstance = this;

    nodecg = extensionApi;
    wordBlacklist = nodecg.Replicant('wordBlacklist', { defaultValue: [] });
}

Wordfilter.prototype.blacklisted = function (string) {
    var blacklist = wordBlacklist.value;
    if (!blacklist || !string) {
        return false;
    }
    return blacklist.indexOf(string.toLowerCase()) > -1;
};

module.exports = function(extensionApi) { return new Wordfilter(extensionApi); };
