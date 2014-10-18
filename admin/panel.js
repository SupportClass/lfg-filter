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

        // event.item: contains the item
        // event.cancel: set to true to prevent the item getting added
        var msg = {
            bundleName: 'eol-filter',
            messageName: 'addWords',
            content: [event.item] //backend expects an array
        };

        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg._socket.emit('message', msg, function (numAdded) {
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

        // event.item: contains the item
        // event.cancel: set to true to prevent the item getting added
        var msg = {
            bundleName: 'eol-filter',
            messageName: 'addAddresses',
            content: [event.item] //backend expects an array
        };

        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg._socket.emit('message', msg, function (numAdded) {
            if (numAdded) {
                updateAddressList();
            } else {
                wordBl.tagsinput('remove', event.item);
                console.error('[eol-filter] Failed to add address(es) to blacklist');
            }
        });
    });

    wordBl.on('beforeItemRemove', function(event) {
        // event.item: contains the item
        // event.cancel: set to true to prevent the item getting added
        var msg = {
            bundleName: 'eol-filter',
            messageName: 'removeWords',
            content: [event.item] //backend expects an array
        };

        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg._socket.emit('message', msg, function (numRemoved) {
            if (numRemoved) {
                updateWordList();
            } else {
                wordBl.tagsinput('add', event.item);
                console.error('[eol-filter] Failed to remove word(s) from blacklist');
            }
        });
    });
    addressBl.on('beforeItemRemove', function(event) {
        // event.item: contains the item
        // event.cancel: set to true to prevent the item getting added
        var msg = {
            bundleName: 'eol-filter',
            messageName: 'removeAddresses',
            content: [event.item] //backend expects an array
        };

        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg._socket.emit('message', msg, function (numRemoved) {
            if (numRemoved) {
                updateAddressList();
            } else {
                wordBl.tagsinput('add', event.item);
                console.error('[eol-filter] Failed to remove address(es) from blacklist');
            }
        });
    });

    function updateWordList() {
        var msg = {
            bundleName: 'eol-filter',
            messageName: 'getWordBlacklist'
        };

        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg._socket.emit('message', msg, function (blacklist) {
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
        var msg = {
            bundleName: 'eol-filter',
            messageName: 'getAddressBlacklist'
        };

        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg._socket.emit('message', msg, function (blacklist) {
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
