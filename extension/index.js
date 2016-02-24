'use strict';

module.exports = function (nodecg) {
	return {
		wordfilter: require('./wordfilter')(nodecg),
		emailfilter: require('./emailfilter')(nodecg)
	};
};
