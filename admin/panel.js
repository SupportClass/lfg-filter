$(document).ready(function () {
    
    var wordModal = $('#eol-filter_word');
    var addressModal = $('#eol-filter_address');
    var wordBl = wordModal.find('.blacklist');
    var addressBl = addressModal.find('.blacklist');

    nodecg.declareSyncedVar({ variableName: 'wordBlacklist',
        initialVal: [],
        setter: function(newVal) {
            wordBl.tagsinput('removeAll');

            var len = newVal.length;
            for (var i = 0; i < len; i++) {
                wordBl.tagsinput('add', newVal[i]);
            }
        }
    });

    nodecg.declareSyncedVar({ variableName: 'emailBlacklist',
        initialVal: [],
        setter: function(newVal) {
            addressBl.tagsinput('removeAll');

            var len = newVal.length;
            for (var i = 0; i < len; i++) {
                addressBl.tagsinput('add', newVal[i]);
            }
        }
    });

    wordBl.tagsinput({
        trimValue: true
    });
    addressBl.tagsinput({
        trimValue: true
    });

    //triggered when modal is about to be shown
    wordModal.on('show.bs.modal', function(e) {
        addressBl.val(nodecg.variables.wordBlacklist);
        wordBl.tagsinput('focus');
    });
    addressModal.on('show.bs.modal', function(e) {
        addressBl.val(nodecg.variables.emailBlacklist);
        addressBl.tagsinput('focus');
    });

    //triggered when modal is about to be hidden
    wordModal.on('hide.bs.modal', function(e) {
        var arr = wordBl.val();
        if (!arr)
            arr = [];

        var len = arr.length;
        for (var i = 0; i < len; i++) {
            arr[i] = arr[i].toLowerCase();
        }
        nodecg.variables.wordBlacklist = arr;
    });
    addressModal.on('hide.bs.modal', function(e) {
        var arr = addressBl.val();
        if (!arr)
            arr = [];

        var len = arr.length;
        for (var i = 0; i < len; i++) {
            arr[i] = arr[i].toLowerCase();
        }

        nodecg.variables.emailBlacklist = arr;
    });
    
});
