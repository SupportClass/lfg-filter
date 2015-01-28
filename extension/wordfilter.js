'use strict';
// Exports an wordfilter singleton

var db = require('./db');
var Q = require('q');
var nodecg = {};
var ID = '_wordblacklist';

function Wordfilter(extensionApi) {
    if (Wordfilter.prototype._singletonInstance) {
        return Wordfilter.prototype._singletonInstance;
    }
    Wordfilter.prototype._singletonInstance = this;

    nodecg = extensionApi;
    var self = this;

    this.init()
        .then(function(blacklist) {
            nodecg.declareSyncedVar({ variableName: 'wordBlacklist',
                initialVal: blacklist.words,
                setter: function(newVal) {
                    self.write(newVal);
                }
            });
        })
        .fail(function(err) {
            throw err;
        });
}

Wordfilter.prototype.init = function() {
    var deferred = Q.defer();
    db.findOne({ _id: ID }, function (err, doc) {
        if (err) {
            deferred.reject(new Error(err));
        } else if (doc === null) {
            // If the train isn't in the DB, make a new one with defaults
            var defaultList = { _id: ID, words: [] };

            db.insert(defaultList, function (err, newDoc) {
                if (err) {
                    deferred.reject(new Error(err));
                } else {
                    deferred.resolve(newDoc);
                }
            });
        } else {
            // Else, return the train already present in the DB
            deferred.resolve(doc);
        }
    });
    return deferred.promise;
};

Wordfilter.prototype.write = function(words) {
    db.update({ _id: ID }, { words: words }, { upsert: true }, function (err) {
        if (err) nodecg.log.error(err.stack);
    });
};

Wordfilter.prototype.blacklisted = function (string) {
    var blacklist = nodecg.variables.wordBlacklist;
    if (!blacklist || !string) {
        return false;
    }

    for (var i = 0; i < blacklist.length; i++) {
        if (string.toLowerCase().indexOf(blacklist[i]) >= 0) {
            return true;
        }
    }

    return false;
};

module.exports = function(extensionApi) { return new Wordfilter(extensionApi); };