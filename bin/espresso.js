#!/usr/bin/env node

/*!
 * The M-Project - Mobile HTML5 Application Framework
 * espresso - the main command line
 * @author pfleidi
 */

var COMMAND_FOLDER = __dirname + '/../core/commands/';
var cmdParser = require('../lib/commandparser').create(COMMAND_FOLDER, 'espresso');
var args;

if (process.argv[0].slice(-4) == "node") {
  args = process.argv.slice(2);
} else {
  args = process.argv.slice(1);
}

cmdParser.dispatch(args);
