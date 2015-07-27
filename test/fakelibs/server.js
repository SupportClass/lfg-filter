'use strict';

var fs = require('fs');
var path = require('path');
var panels = require('./panel_parser')();
var injectScripts = require('./script_injector');

/* Largely copied from nodecg/lib/dashboard/index.js */
var app = require('express')();
app.listen(9999);

app.get('/components/*', function(req, res, next) {
    var resName = req.params[0];
    var fileLocation = path.resolve(__dirname, '../../bower_components', resName);

    // Check if the file exists
    if (!fs.existsSync(fileLocation)) {
        next();
        return;
    }

    res.sendFile(fileLocation);
});
/* End block copied from nodecg/lib/dashboard/index.js */

app.get('/stubs/*', function(req, res, next) {
    var resName = req.params[0];
    var fileLocation = path.resolve(__dirname, '../stubs/', resName);

    // Check if the file exists
    if (!fs.existsSync(fileLocation)) {
        next();
        return;
    }

    res.sendFile(fileLocation);
});

app.get('/:panel', function(req, res, next) {
    var panelName = req.params.panel;
    var panel = null;
    panels.some(function(p) {
        if (p.name === panelName) {
            panel = p;
            return true;
        } else {
            return false;
        }
    });
    if (!panel) {
        next();
        return;
    }

    var fileLocation = path.join(__dirname, '../../dashboard/', panel.file);

    var html;
    if (panel.dialog) {
        html = injectScripts(fileLocation, 'lfg-filter', 'dialog');
    } else {
        html = injectScripts(fileLocation, 'lfg-filter', 'panel');
    }

    res.send(html);
});

module.exports = app;
