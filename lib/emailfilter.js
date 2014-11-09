'use strict';
// Exports an emailfilter singleton

var Datastore = require('nedb');
var db = new Datastore({ filename: './db/emailfilter.db', autoload: true });
var Q = require('q');

// Automatically compact the DB every 5 minutes
db.persistence.setAutocompactionInterval(300000);

function Emailfilter() {}

Emailfilter.prototype.blacklisted = function (string) {
    var deferred = Q.defer();
    this.getList()
        .then(function (blacklist) {
            if (!blacklist || !string) {
                deferred.resolve(false);
            }

            if(blacklist.indexOf(string.toLowerCase()) > -1) {
                deferred.resolve(true);
            }

            deferred.resolve(false);
        }, function (reason) {
            deferred.reject(new Error(reason));
        });
    return deferred.promise;
};

Emailfilter.prototype.addAddresses = function (addresses) {
    for (var i = 0; i < addresses.length; i++) {
        addresses[i] = addresses[i].toLowerCase();
    }

    // Upserting the addresses
    var deferred = Q.defer();
    db.update({ _id: 'blacklist' }, { $addToSet: { addresses: { $each: addresses } } }, { upsert: true }, function (err, numAdded) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(numAdded);
        }
    });
    return deferred.promise;
};

Emailfilter.prototype.removeAddresses = function (addresses) {
    var deferred = Q.defer();
    db.update({ _id: 'blacklist' }, { $pull: { addresses: { $in: addresses } } }, { upsert: true }, function (err, numRemoved) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(numRemoved);
        }
    });
    return deferred.promise;
};

Emailfilter.prototype.clearList = function () {
    // Delete all addresses in the datastore
    var deferred = Q.defer();
    db.remove({}, { multi: true }, function (err, numRemoved) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(numRemoved);
        }
    });
    return deferred.promise;
};

Emailfilter.prototype.getList = function() {
    // Find all addresses in the datastore
    var deferred = Q.defer();
    db.findOne({ _id: 'blacklist' }, function (err, blacklist) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(blacklist
                ? blacklist.addresses
                : []
            );
        }
    });
    return deferred.promise;
};

module.exports = new Emailfilter();