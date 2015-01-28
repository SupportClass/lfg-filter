'use strict';
// Exports an emailfilter singleton

var db = require('./db');
var Q = require('q');
var nodecg = {};
var ID = '_emailblacklist';

function Emailfilter(extensionApi) {
    if (Emailfilter.prototype._singletonInstance) {
        return Emailfilter.prototype._singletonInstance;
    }
    Emailfilter.prototype._singletonInstance = this;

    nodecg = extensionApi;
    var self = this;

    this.init()
        .then(function(blacklist) {
            nodecg.declareSyncedVar({ variableName: 'emailBlacklist',
                initialVal: blacklist.addresses,
                setter: function(newVal) {
                    self.write(newVal);
                }
            });
        })
        .fail(function(err) {
            throw err;
        });
}

Emailfilter.prototype.init = function() {
    var deferred = Q.defer();
    db.findOne({ _id: ID }, function (err, doc) {
        if (err) {
            deferred.reject(new Error(err));
        } else if (doc === null) {
            // If the train isn't in the DB, make a new one with defaults
            var defaultList = { _id: ID, addresses: [] };

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

Emailfilter.prototype.write = function(addresses) {
    db.update({ _id: ID }, { addresses: addresses }, { upsert: true }, function (err) {
        if (err) nodecg.log.error(err.stack);
    });
};

Emailfilter.prototype.blacklisted = function (string) {
    var blacklist = nodecg.variables.emailBlacklist;
    if (!blacklist || !string) {
        return false;
    }

    return blacklist.indexOf(string.toLowerCase()) > -1;
};

module.exports = function(extensionApi) { return new Emailfilter(extensionApi); };