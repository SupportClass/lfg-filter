$(document).ready(function () {
    
    var wordModal = $('#eol-filter_word');
    var addressModal = $('#eol-filter_address');
    var wordBl = wordModal.find('.blacklist');
    var addressBl = addressModal.find('.blacklist');
    var dontUpdateWordBl = true;
    var dontUpdateAddressBl = true;

    wordBl.tagsinput({
        trimValue: true
    });
    addressBl.tagsinput({
        trimValue: true
    });

    //triggered when modal is about to be shown
    wordModal.on('show.bs.modal', function(e) {
        updateWordList();
        wordBl.tagsinput('focus');
    });
    //triggered when modal is about to be shown
    addressModal.on('show.bs.modal', function(e) {
        updateAddressList();
        addressBl.tagsinput('focus');
    });

    wordBl.on('beforeItemAdd', function(event) {
        // Hack to prevent infinite loop when initial data is gotten from backend
        if (dontUpdateWordBl)
            return;

        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg.sendMessage('addWords', [event.item], function (numAdded) {
            if (numAdded) {
                updateWordList();
            } else {
                wordBl.tagsinput('remove', event.item);
                console.error('[eol-filter] Failed to add word(s) to blacklist');
            }
        });
    });
    addressBl.on('beforeItemAdd', function(event) {
        // Hack to prevent infinite loop when initial data is gotten from backend
        if (dontUpdateAddressBl)
            return;

        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg.sendMessage('addAddresses', [event.item], function (numAdded) {
            if (numAdded) {
                updateAddressList();
            } else {
                wordBl.tagsinput('remove', event.item);
                console.error('[eol-filter] Failed to add address(es) to blacklist');
            }
        });
    });

    wordBl.on('beforeItemRemove', function(event) {
        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg.sendMessage('removeWords', [event.item], function (numRemoved) {
            if (numRemoved) {
                updateWordList();
            } else {
                wordBl.tagsinput('add', event.item);
                console.error('[eol-filter] Failed to remove word(s) from blacklist');
            }
        });
    });
    addressBl.on('beforeItemRemove', function(event) {
        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg.sendMessage('removeAddresses', [event.item], function (numRemoved) {
            if (numRemoved) {
                updateAddressList();
            } else {
                wordBl.tagsinput('add', event.item);
                console.error('[eol-filter] Failed to remove address(es) from blacklist');
            }
        });
    });

    function updateWordList() {
        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg.sendMessage('getWordBlacklist', {}, function (blacklist) {
            if (blacklist) {
                dontUpdateWordBl = true;

                wordBl.tagsinput('removeAll');

                blacklist.forEach(function(word) {
                    wordBl.tagsinput('add', word);
                });

                dontUpdateWordBl = false;
            } else {
                console.error('[eol-filter] Failed to retrieve word blacklist');
            }
        });
    }

    function updateAddressList() {
        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg.sendMessage('getAddressBlacklist', {}, function (blacklist) {
            if (blacklist) {
                dontUpdateAddressBl = true;

                addressBl.tagsinput('removeAll');

                blacklist.forEach(function(word) {
                    addressBl.tagsinput('add', word);
                });

                dontUpdateAddressBl = false;
            } else {
                console.error('[eol-filter] Failed to retrieve address blacklist');
            }
        });
    }

    
});
