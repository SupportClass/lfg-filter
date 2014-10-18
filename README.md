#eol-filter

This bundle provides `wordfilter` and `emailfilter` singletons that other bundles can use to check if a string contains profanity or if an email address is blacklisted.
It also has a dashboard panel that allows the end user to add and remove phrases from the blacklists.

## Installation

- Install to `nodecg/bundles/eol-wordfilter`
- Run NodeCG, open your dashboard, and use the Filter panel to edit the blacklists

## Usage
Add the following to your bundles' `index.js`
```
var wordfilter = require('../eol-wordfilter').wordfilter;
var emailfilter = require('../eol-wordfilter').emailfilter;

// Returns 'true' if the string contains profanity
if (wordfilter.blacklisted('this is a string') {
    console.log('bad words found');
} else {
    console.log('squeaky clean');
}

// Returns 'true' if the address is blacklisted
if (emailfilter.blacklisted('test@example.com') {
    console.log('email blacklisted');
} else {
    console.log('looks good to me, chief');
}
```
