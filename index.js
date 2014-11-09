'use strict';

var wordfilter = require('./lib/wordfilter');
var emailfilter = require('./lib/emailfilter');
var io = require('../../server.js');

io.sockets.on('connection', function (socket) {
    socket.on('message', function (data, fn) {
        if (data.bundleName !== 'eol-filter') {
            return;
        }

        if (data.messageName === 'getWordBlacklist') {
            wordfilter.getList()
                .then(function (blacklist) {
                    fn(blacklist);
                });
        }

        if (data.messageName === 'addWords') {
            wordfilter.addWords(data.content)
                .then(function (numAdded) {
                    fn(numAdded);
                });
        }

        if (data.messageName === 'removeWords') {
            wordfilter.removeWords(data.content)
                .then(function (numRemoved) {
                    fn(numRemoved);
                });
        }

        if (data.messageName === 'getAddressBlacklist') {
            emailfilter.getList()
                .then(function (blacklist) {
                    fn(blacklist);
                });
        }

        if (data.messageName === 'addAddresses') {
            emailfilter.addAddresses(data.content)
                .then(function (numAdded) {
                    fn(numAdded);
                });
        }

        if (data.messageName === 'removeAddresses') {
            emailfilter.removeAddresses(data.content)
                .then(function (numRemoved) {
                    fn(numRemoved);
                });
        }
    });
});

module.exports.wordfilter = wordfilter;
module.exports.emailfilter = emailfilter;
