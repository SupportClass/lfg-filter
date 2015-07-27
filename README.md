#lfg-filter
This is a [NodeCG](http://github.com/nodecg/nodecg) bundle.

[![Build Status](https://travis-ci.org/SupportClass/lfg-filter.svg?branch=modals-wip)](https://travis-ci.org/SupportClass/lfg-filter)

This bundle provides `wordfilter` and `emailfilter` objects that other bundles can use to check if a string contains profanity or if an email address is blacklisted.
It also has a dashboard panel that allows the end user to add and remove phrases from the blacklists. **By default, the blacklists are empty.**

## Installation
- Install to `nodecg/bundles/lfg-filter`
- Run NodeCG, open your dashboard, and use the Filter panel to edit the blacklists

## Usage
Add `lfg-filter` as a `bundleDependency` in your bundle's [`nodecg.json`](https://github.com/nodecg/nodecg/wiki/nodecg.json)

Then add the following to your bundle's extension:
```javascript
var wordfilter = nodecg.extensions['lfg-filter'].wordfilter;
var emailfilter = nodecg.extensions['lfg-filter'].emailfilter;

// Returns 'true' if the string contains profanity
if (wordfilter.blacklisted('this is a string')) {
    console.log('bad words found');
} else {
    console.log('squeaky clean');
}

// Returns 'true' if the address is blacklisted
if (emailfilter.blacklisted('test@example.com')) {
    console.log('email blacklisted');
} else {
    console.log('looks good to me, chief');
}
```

### License
lfg-filter is provided under the MIT license, which is available to read in the [LICENSE][] file.
[license]: LICENSE
