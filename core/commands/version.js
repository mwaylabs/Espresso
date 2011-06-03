/*!
 * version.js
 *
 * Command module to print the Espresso version
 *
 * Copyright(c) 2011 Panacoda GmbH. All rights reserved.
 * his file is licensed under the MIT license.
 *
 * @author tv
 */

var E = require('../e').E;

exports.description = 'Command to print the Espresso version';

exports.options = {

  directory: {
    'description': exports.description,
    'hasargument': false
  }

};

exports.run = function run() {
  var e = new E;
  e.printVersionNumber();
};
