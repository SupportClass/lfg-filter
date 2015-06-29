'use strict';

module.exports = function(nodecg) {
    return {
        wordfilter: require('./extension/wordfilter')(nodecg),
        emailfilter: require('./extension/emailfilter')(nodecg)
    };
};
