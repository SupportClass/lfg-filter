'use strict';

var nodecg = {};

function Filter(extensionApi) {
    if (Filter.prototype._singletonInstance) {
        return Filter.prototype._singletonInstance;
    }
    Filter.prototype._singletonInstance = this;

    nodecg = extensionApi;

    nodecg.listenFor('getWordBlacklist', function getWordBlacklist(data, cb) {
        wordfilter.getList()
            .then(function (blacklist) {
                cb(blacklist);
            });
    });

    nodecg.listenFor('addWords', function addWords(data, cb) {
        wordfilter.addWords(data.content)
            .then(function (numAdded) {
                cb(numAdded);
            });
    });

    nodecg.listenFor('removeWords', function removeWords(data, cb) {
        wordfilter.removeWords(data.content)
            .then(function (numRemoved) {
                cb(numRemoved);
            });
    });

    nodecg.listenFor('getAddressBlacklist', function getAddressBlacklist(data, cb) {
        emailfilter.getList()
            .then(function (blacklist) {
                cb(blacklist);
            });
    });

    nodecg.listenFor('addAddresses', function addAddresses(data, cb) {
        emailfilter.addAddresses(data.content)
            .then(function (numAdded) {
                cb(numAdded);
            });
    });

    nodecg.listenFor('removeAddresses', function removeAddresses(data, cb) {
        emailfilter.removeAddresses(data.content)
            .then(function (numRemoved) {
                cb(numRemoved);
            });
    });
}

Filter.wordfilter = require('./lib/wordfilter');
Filter.emailfilter = require('./lib/emailfilter');

module.exports = function(extensionApi) { new Filter(extensionApi) };
