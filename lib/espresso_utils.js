/*!
 * espresso_utils.js
 * 
 * Abstract Mustache rendering into less noisier functions
 *
 * Copyright(c) 2011 M-Way Solutions GmbH. All rights reserved.
 * MIT and GPL Licensed
 *
 * @author pfleidi
 */

var Fs = require('fs');
var Util = require('util');
var Style = require('./color');

var log = exports.log = function (message) {
  console.log(Style.green('LOG: ' + message));
};

var logErr = exports.logErr = function (message) {
  console.error(Style.red('ERROR: ') + Style.cyan(message));
};

exports.readConfig = function readConfig(directory) {
  var content = Fs.readFileSync(directory + '/config.json', 'utf8');
  
  try {
    return JSON.parse(content);
  } catch (err) {
    logErr('while reading "config.json", error message: ' + err.message);
    // exit the process, reason: error in config.json
    process.exit(1);
  }
};

exports.touchPath = function touchPath(path){
  try {
    Fs.statSync(path);
    return true;
  } catch (ex){
    return false
  }
};
