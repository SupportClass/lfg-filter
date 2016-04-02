'use strict';

module.exports = function (nodecg) {
	const emailBlacklist = nodecg.Replicant('emailBlacklist', {defaultValue: []});
	return function (string) {
		const blacklist = emailBlacklist.value;
		if (!blacklist || !string) {
			return false;
		}

		string = string.toLowerCase();
		return blacklist.indexOf(string.toLowerCase()) > -1;
	};
};
