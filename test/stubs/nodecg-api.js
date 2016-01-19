(function() {
    'use strict';

    window._replicants = {
        wordBlacklist: new window.EventEmitter2(),
        emailBlacklist: new window.EventEmitter2()
    };

    window._replicants.wordBlacklist.value = [];
    window._replicants.emailBlacklist.value = [];

    window.nodecg = {
        Replicant: function(name) {
            return window._replicants[name];
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        window._replicants.wordBlacklist.value = ['one', 'two'];
        window._replicants.wordBlacklist.emit('change', [], window._replicants.wordBlacklist.value);

        window._replicants.emailBlacklist.value = ['test@email.com', 'foo@bar.edu'];
        window._replicants.emailBlacklist.emit('change', [], window._replicants.emailBlacklist.value);
    }, false);
})();
