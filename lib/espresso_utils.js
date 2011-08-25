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

/**
 * Synchronously check if a file already exists.
 *
 * @param {String} path
 * @param {Function} callback
 */
exports.fileExistsSync = function touchPath(path) {
  try {
    Fs.statSync(path);
    return true;
  } catch (ex){
    return false
  }
};

/**
 * Checker if a file already exists.
 * @param {String} path
 * @param {Function} callback
 */
exports.fileExists = function fileExists(path, callback) {
  Fs.stat(path, function(err, fd) {
      if (err) {
        callback(false);
      } else {
        callback(true);
      }
    });
};

/**
 * Generate an HTML string.
 *
 * The optional attribute argument is either a flat JSON object, where the
 * properties are key-value pairs.
 *
 * Boolean true properties are rendered as attribute names,
 * boolean false and undefined properties are not rendered at all,
 * and anything else gets rendered as key="value" using value.toString() and
 * JSON.stringify().
 *
 * @param {string} tag name
 * @param {object} tag attributes
 * @param {string} inner HTML
 * @returns {string} the HTML tag as a string
 */
exports.HTML = function (tagName, attrs, innerHTML) {
  attrs = typeof attrs !== 'object'
    ? []
    : Object.keys(attrs).filter(function (key) {
        var value = attrs[key];
        switch (typeof value) {
          case 'undefined': return false;
          case 'boolean': return value;
          default: return true;
        };
      }).map(function (key) {
        var value = attrs[key];
        switch (typeof value) {
          case 'boolean': return key;
          default: return '' + key + '=' + JSON.stringify(value.toString());
        };
      })
    ;

  var html = '<' + [tagName].concat(attrs).join(' ') + '>';

  if (typeof innerHTML === 'string') {
    html += innerHTML + '</' + tagName + '>';
  };
  
  return html;
};
