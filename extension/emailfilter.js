'use strict';

module.exports = function (nodecg) {
	var emailBlacklist = nodecg.Replicant('emailBlacklist', {defaultValue: []});
	return function (string) {
		var blacklist = emailBlacklist.value;
		if (!blacklist || !string) return false;
		string = string.toLowerCase();
		return blacklist.indexOf(string.toLowerCase()) > -1;
	};
};
