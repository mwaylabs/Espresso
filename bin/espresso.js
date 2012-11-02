#!/usr/bin/env node

/*!
 * The M-Project - Mobile HTML5 Application Framework
 * espresso - the main command line
 * @author pfleidi
 */

var fs = require('fs');
var path = require('path');

var espresso_root = path.dirname(path.dirname(fs.realpathSync(__filename)));

var COMMAND_FOLDER = path.join(espresso_root, 'core', 'commands');
var commandparser = require(path.join(espresso_root, 'lib', 'commandparser'));

var cmdParser = commandparser.create(COMMAND_FOLDER + '/', 'espresso');
var args;

if (process.argv[0].slice(-4) == "node" || process.argv[0].slice(-8) == "node.exe") {
  args = process.argv.slice(2);
} else {
  args = process.argv.slice(1);
}

cmdParser.dispatch(args);
