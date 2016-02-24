'use strict';

module.exports = function (nodecg) {
	var wordBlacklist = nodecg.Replicant('wordBlacklist', {defaultValue: []});
	return function (string) {
		var match = false;
		var blacklist = wordBlacklist.value;
		if (!blacklist || !string) return false;
		string = string.toLowerCase();
		blacklist.some(function (word) {
			word = word.toLowerCase();
			if (string.indexOf(word) >= 0) match = true;
			return match;
		});
		return match;
	};
};
