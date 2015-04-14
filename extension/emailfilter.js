'use strict';
// Exports an emailfilter singleton

var nodecg = {};
var emailBlacklist;

function Emailfilter(extensionApi) {
    if (Emailfilter.prototype._singletonInstance) {
        return Emailfilter.prototype._singletonInstance;
    }
    Emailfilter.prototype._singletonInstance = this;

    nodecg = extensionApi;
    emailBlacklist = nodecg.Replicant('emailBlacklist', { defaultValue: [] });
}

Emailfilter.prototype.blacklisted = function (string) {
    var blacklist = emailBlacklist.value;
    if (!blacklist || !string) {
        return false;
    }
    return blacklist.indexOf(string.toLowerCase()) > -1;
};

module.exports = function(extensionApi) { return new Emailfilter(extensionApi); };
