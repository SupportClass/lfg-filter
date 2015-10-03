'use strict';

describe('wordfilter', function() {
    before(function() {
        var nodecg = {
            Replicant: function() {
                return {value: ['butts']};
            }
        };

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

describe('edit wordfilter dialog', function() {
    before(function* () {
        yield browser.url('http://localhost:9999/edit-wordfilter');
    });

    it('should display all existing words in the blacklist', function* () {
        var tagTexts = yield browser.getText('#tag-value');
        tagTexts.should.deep.equal(['one', 'two']);
    });

    it('should add new words to the blacklist', function* () {
        yield browser.setValue('#tag-input input', 'three').keys('Enter');
        var tagTexts = yield browser.getText('#tag-value');
        var replicantValue = (yield browser.execute(function() {
            return window._replicants.wordBlacklist.value;
        })).value;

        tagTexts.should.deep.equal(['one', 'two', 'three']);
        replicantValue.should.deep.equal(['one', 'two', 'three']);
    });
});

describe('edit emailfilter dialog', function() {
    before(function* () {
        yield browser.url('http://localhost:9999/edit-emailfilter');
    });

    it('should display all existing addresses in the blacklist', function* () {
        var tagTexts = yield browser.getText('#tag-value');
        tagTexts.should.deep.equal(['test@email.com', 'foo@bar.edu']);
    });

    it('should add new words to the blacklist', function* () {
        yield browser.setValue('#tag-input input', 'third@email.org').keys('Enter');
        var tagTexts = yield browser.getText('#tag-value');
        var replicantValue = (yield browser.execute(function() {
            return window._replicants.emailBlacklist.value;
        })).value;

        tagTexts.should.deep.equal(['test@email.com', 'foo@bar.edu', 'third@email.org']);
        replicantValue.should.deep.equal(['test@email.com', 'foo@bar.edu', 'third@email.org']);
    });
});
