var express = require('express');
var app = module.exports = express();
var wordfilter = require('./lib/wordfilter');
var io = require('../../server.js');

io.sockets.on('connection', function (socket) {
    socket.on('message', function (data, fn) {
        if (data.bundleName !== 'eol-wordfilter') {
            return;
        }

        if (data.messageName === 'getBlacklist') {
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
    });
});

module.exports.wordfilter = wordfilter;
