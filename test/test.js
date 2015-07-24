'use strict';

var webdriverio = require('webdriverio');
var sinon = require('sinon');
require('chai').should();

describe('wordfilter', function() {
    before(function() {
        var nodecg = {Replicant: function(){}};
        sinon.stub(nodecg, 'Replicant', function() {
            return {value: ['butts']};
        });

        this.wordfilter = require('../extension/wordfilter')(nodecg);
    });

    it('should return "true" when a word is blacklisted', function() {
        this.wordfilter('butts').should.be.true;
    });

    it('should return "false" when a word isn\'t blacklisted', function() {
        this.wordfilter('dope').should.be.false;
    });

    it('should return "true" when part of a word is blacklisted', function() {
        this.wordfilter('prebutts').should.be.true;
        this.wordfilter('buttspost').should.be.true;
        this.wordfilter('prebuttspost').should.be.true;
    });
});

describe('panel', function() {
    before(function() {
        var browser;
        if (process.env.TRAVIS_OS_NAME && process.env.TRAVIS_JOB_NUMBER) {
            console.log('Travis environment detected, running WebDriver.io with Travis capabilities');
            var desiredCapabilities = {
                name: 'Travis job ' + process.env.TRAVIS_JOB_NUMBER,
                build: process.env.TRAVIS_BUILD_NUMBER,
                tags: [process.env.TRAVIS_BRANCH, process.env.TRAVIS_COMMIT, process.env.TRAVIS_COMMIT_RANGE],
                browserName: 'chrome',
                version: 'beta',
                tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
            };

            if (process.env.TRAVIS_PULL_REQUEST !== 'false') {
                desiredCapabilities.tags.push(process.env.TRAVIS_PULL_REQUEST);
            }

            if (process.env.TRAVIS_TAG) {
                desiredCapabilities.tags.push(process.env.TRAVIS_TAG);
            }

            if (process.env.TRAVIS_OS_NAME === 'linux') {
                desiredCapabilities.platform = 'Linux';
            } else if (process.env.TRAVIS_OS_NAME === 'osx') {
                desiredCapabilities.platform = 'OS X 10.10';
            }

            browser = webdriverio.remote({
                desiredCapabilities: desiredCapabilities,
                host: 'ondemand.saucelabs.com',
                port: 80,
                user: process.env.SAUCE_USERNAME,
                key: process.env.SAUCE_ACCESS_KEY
            });
        } else {
            console.log('Running WebDriver.io with local capabilities');
            browser = webdriverio.remote({
                desiredCapabilities: {
                    browserName: 'chrome'
                }
            });
        }

        this.browser = browser;
    });
});
