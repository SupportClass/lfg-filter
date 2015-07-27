'use strict';

var path = require('path');
var fs = require('fs');
var cheerio = require('cheerio');

module.exports = function() {
    var panels = [];
    var manifestPath = path.resolve(__dirname, '../../dashboard/panels.json');

    var manifest;
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.forEach(function(panel, index) {
        try {
            var missingProps = [];
            if (typeof(panel.name) === 'undefined') missingProps.push('name');
            if (typeof(panel.title) === 'undefined') missingProps.push('title');
            if (typeof(panel.file) === 'undefined') missingProps.push('file');
            if (missingProps.length) {
                console.error('Panel #%d could not be parsed as it is missing the following properties:',
                    index, missingProps.join(', '));
                return;
            }

            // Check if this bundle already has a panel by this name
            var dupeFound = panels.some(function(p) {
                return p.name === panel.name;
            });
            if (dupeFound) {
                console.error('Panel #%d (%s) has the same name as another panel in this bundle, '
                    + 'and will not be loaded.', index, panel.name);
                return;
            }

            var filePath = path.resolve(__dirname, '../../dashboard/', panel.file);

            // check that the panel file exists, throws error if it doesn't
            /* jshint -W016 */
            fs.accessSync(filePath, fs.F_OK | fs.R_OK);
            /* jshint +W016 */

            var $ = cheerio.load(fs.readFileSync(filePath));

            // Check that the panel has a <head> tag, which we need to inject our scripts.
            if ($('head').length < 1) {
                console.error('Panel "%s" has no <head>, cannot inject scripts. Panel will not be loaded.',
                    path.basename(panel.file));
                return;
            }

            // Check that the panel has a DOCTYPE
            var html = $.html();
            if (html.indexOf('<!DOCTYPE') < 0) {
                console.error('Panel "%s" has no DOCTYPE, panel resizing will not work. '
                    + 'Panel will not be loaded.', path.basename(panel.file));
                return;
            }

            panel.width = panel.width || 1;
            panel.dialog = !!panel.dialog; // No undefined please

            panels.push(panel);
        } catch (e) {
            console.error('Error parsing panel \'%s\'\n', panel.name, e.message);
        }
    });

    return panels;
};
