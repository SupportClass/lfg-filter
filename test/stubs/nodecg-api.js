(function() {
    'use strict';

    window.replicant = new window.EventEmitter2();
    window.replicant.value = [];

    window.nodecg = {
        Replicant: function() {
            return window.replicant;
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        window.replicant.value = ['one', 'two'];
        window.replicant.emit('change', [], window.replicant.value);
    }, false);
})();
