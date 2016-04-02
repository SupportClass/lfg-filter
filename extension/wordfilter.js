'use strict';

module.exports = function (nodecg) {
	const wordBlacklist = nodecg.Replicant('wordBlacklist', {defaultValue: []});
	return function (string) {
		let match = false;
		const blacklist = wordBlacklist.value;
		if (!blacklist || !string) {
			return false;
		}
		string = string.toLowerCase();
		blacklist.some(word => {
			word = word.toLowerCase();
			if (string.indexOf(word) >= 0) {
				match = true;
			}
			return match;
		});
		return match;
	};
};
