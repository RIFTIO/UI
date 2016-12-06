define(function (require) {
    var base_plugins = ['about', 'accounts', 'composer', 'debug', 'goodbyeworld', 'helloworld', 'launchpad', 'logging'];
    var registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');
    var plugin_discoverer = require('intern/dojo/node!../../framework/core/modules/plugin_discoverer.js');
    var skyquakeEmitter = require('intern/dojo/node!../../framework/core/modules/skyquakeEmitter.js');
    var _ = require('intern/dojo/node!lodash');
    var fs = require('intern/dojo/node!fs');
    registerSuite({
        name: 'plugin_discoverer',
        before: function() {

        },
        after: function() {
            // Exit process.
            // TODO: Should cleanup plugin_discoverer instead and call that
            setTimeout(function() {
                var path = process.cwd() + '/plugins/helloworld/test.txt';
                fs.unlinkSync(path);
                process.exit(0);
            });
        },
        'Test init': function () {
            var res = plugin_discoverer.init();
            assert.isUndefined(res, 'return value is undefined');
        },
        'Test config': function() {
            var path = process.cwd() + '/plugins';
            var res = plugin_discoverer.config({
                plugins_path: path
            });
            assert.isUndefined(res, 'return value is undefined');
        },
        'Test run plugin add discovery': function() {
            var deferred = this.async();

            var plugins_detected = [];

            skyquakeEmitter.on('plugin_discoverer.plugin_discovered', function(plugin_name) {
                plugins_detected.push(plugin_name);
                if (_.intersection(plugins_detected, base_plugins).length == 8 ) {
                    // all expected plugins were discovered
                    deferred.resolve('All expected plugins discovered');
                }
            });

            var res = plugin_discoverer.run();
        },
        'Test run plugin update discovery': function() {
            var deferred = this.async();

            setTimeout(function() {
                var path = process.cwd() + '/plugins/helloworld/test.txt';
                fs.openSync(path, 'a+');
            });

            skyquakeEmitter.on('plugin_discoverer.plugin_updated', function(plugin_name) {
                deferred.resolve(); 
            });
        },
    });
});
