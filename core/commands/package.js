/*!
 * package.js
 *
 * This command is a Deprecated!
 *
 * Copyright(c) 2013 Panacoda GmbH. All rights reserved.
 * This file is licensed under the MIT license.
 */

exports.description = 'Deprecated!';

exports.usage = ('');

exports.examples = [];

exports.options = {};

var Style = require('../../lib/color');

exports.run = function (options, positional) {
    console.log(Style.red('did you mean the cordova CLI: ') + './path/to/cordova-ios/bin/create /path/to/my_new_cordova_project com.example.cordova_project_name' + Style.green(' :-)'));
    console.log(Style.blue('http://docs.phonegap.com/en/2.7.0/guide_command-line_index.md.html#Command-Line%20Usage'));
};