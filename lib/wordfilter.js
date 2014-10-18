// Exports a wordfilter singleton

var Datastore = require('nedb');
var db = new Datastore({ filename: './bundles/eol-filter/lib/wordfilter.db', autoload: true });
var Q = require('q');

// Automatically compact the DB every 5 minutes
db.persistence.setAutocompactionInterval(300000);

function Wordfilter() {}

Wordfilter.prototype.blacklisted = function (string) {
    var deferred = Q.defer();
    this.getList()
        .then(function (blacklist) {
            if (!blacklist || !string) {
                deferred.resolve(false);
            }

            var words = string.split(' ');

            for (var j = 0; j < words.length; j++) {
                var word = words[j].toLowerCase().replace(/\*|\+|\-|\./g, '');
                if(blacklist.indexOf(word) > -1) {
                    deferred.resolve(true);
                }
            }

            deferred.resolve(false);
        }, function (reason) {
            deferred.reject(new Error(reason));
        });
    return deferred.promise;
};

Wordfilter.prototype.addWords = function (words) {
    // Upserting the words
    var deferred = Q.defer();
    db.update({ _id: 'blacklist' }, { $addToSet: { words: { $each: words } } }, { upsert: true }, function (err, numAdded) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(numAdded);
        }
    });
    return deferred.promise;
};

Wordfilter.prototype.removeWords = function (words) {
    var deferred = Q.defer();
    db.update({ _id: 'blacklist' }, { $pull: { words: { $in: words } } }, { upsert: true }, function (err, numRemoved) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(numRemoved);
        }
    });
    return deferred.promise;
};

Wordfilter.prototype.clearList = function () {
    // Delete all words in the datastore
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

Wordfilter.prototype.getList = function() {
    // Find all words in the datastore
    var deferred = Q.defer();
    db.findOne({ _id: 'blacklist' }, function (err, blacklist) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(blacklist
                ? blacklist.words.sort()
                : []
            );
        }
    });
    return deferred.promise;
};

module.exports = exports = new Wordfilter();