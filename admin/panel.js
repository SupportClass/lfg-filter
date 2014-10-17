$(document).ready(function () {
    
    var filterModal = $('#eol-wordfilter_modal');
    var blSel = filterModal.find('.blacklist');
    var dontUpdateBL = true;

    blSel.tagsinput({
        trimValue: true
    });

    //triggered when modal is about to be shown
    filterModal.on('show.bs.modal', function(e) {
        updateListSel();
        blSel.tagsinput('focus');
    });

    blSel.on('beforeItemAdd', function(event) {
        // Hack to prevent infinite loop when initial data is gotten from backend
        if (dontUpdateBL)
            return;

        // event.item: contains the item
        // event.cancel: set to true to prevent the item getting added
        var msg = {
            bundleName: 'eol-wordfilter',
            messageName: 'addWords',
            content: [event.item] //backend expects an array
        };

        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg._socket.emit('message', msg, function (numAdded) {
            if (numAdded) {
                updateListSel();
            } else {
                blSel.tagsinput('remove', event.item);
                console.error('[eol-wordfilter] Failed to add word(s) to blacklist');
            }
        });
    });

    blSel.on('beforeItemRemove', function(event) {
        // event.item: contains the item
        // event.cancel: set to true to prevent the item getting added
        var msg = {
            bundleName: 'eol-wordfilter',
            messageName: 'removeWords',
            content: [event.item] //backend expects an array
        };

        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg._socket.emit('message', msg, function (numRemoved) {
            if (numRemoved) {
                updateListSel();
            } else {
                blSel.tagsinput('add', event.item);
                console.error('[eol-wordfilter] Failed to remove word(s) from blacklist');
            }
        });
    });

    function updateListSel() {
        var msg = {
            bundleName: 'eol-wordfilter',
            messageName: 'getBlacklist'
        };

        // Currently has to use direct socket.io calls as the NodeCG API doesn't support acknowledgements
        nodecg._socket.emit('message', msg, function (blacklist) {
            if (blacklist) {
                dontUpdateBL = true;

                blSel.tagsinput('removeAll');

                blacklist.forEach(function(word) {
                    blSel.tagsinput('add', word);
                });

                dontUpdateBL = false;
            } else {
                console.error('[eol-wordfilter] Failed to retrieve blacklist');
            }
        });
    }
    
});
