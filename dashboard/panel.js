'use strict';

var wordModal = $('#lfg-filter_word');
var addressModal = $('#lfg-filter_address');
var wordBl = wordModal.find('.blacklist');
var addressBl = addressModal.find('.blacklist');

var wordBlacklist = nodecg.Replicant('wordBlacklist');
wordBlacklist.on('change', function(oldVal, newVal) {
    wordBl.tagsinput('removeAll');

    var len = newVal.length;
    for (var i = 0; i < len; i++) {
        wordBl.tagsinput('add', newVal[i]);
    }
});

var emailBlacklist = nodecg.Replicant('emailBlacklist');
emailBlacklist.on('change', function(oldVal, newVal) {
    addressBl.tagsinput('removeAll');

    var len = newVal.length;
    for (var i = 0; i < len; i++) {
        addressBl.tagsinput('add', newVal[i]);
    }
});

wordBl.tagsinput({
    trimValue: true
});
addressBl.tagsinput({
    trimValue: true
});

//triggered when modal is about to be shown
wordModal.on('show.bs.modal', function() {
    addressBl.val(wordBlacklist.value);
    wordBl.tagsinput('focus');
});
addressModal.on('show.bs.modal', function() {
    addressBl.val(emailBlacklist.value);
    addressBl.tagsinput('focus');
});

//triggered when modal is about to be hidden
wordModal.on('hide.bs.modal', function() {
    var arr = wordBl.val() || [];
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        arr[i] = arr[i].toLowerCase();
    }
    wordBlacklist.value = arr;
});
addressModal.on('hide.bs.modal', function() {
    var arr = addressBl.val() || [];
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        arr[i] = arr[i].toLowerCase();
    }
    emailBlacklist.value = arr;
});
