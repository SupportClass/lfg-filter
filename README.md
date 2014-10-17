#eol-wordfilter

This bundle provides a `wordfilter` singleton that other bundles can use to check if a string contains profanity.
It also has a dashboard panel that allows the end user to add and remove phrases from the blacklist.

## Installation

- Install to `nodecg/bundles/eol-wordfilter`
- Run NodeCG, open your dashboard, and use the Wordfilter panel to edit the blacklist

## Usage
Add the following to your bundles' `index.js`
```
var wordfilter = require('../eol-wordfilter').wordfilter;

// Returns 'true' if the string contains profanity
if (wordfilter.blacklisted('this is a string') {
    console.log('bad words found');
} else {
    console.log('squeaky clean');
}
```
