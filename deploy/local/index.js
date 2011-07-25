/*!
 * Espresso local deployment module.
 *
 * Copyright(c) 2011 Panacoda GmbH. All rights reserved.
 * This file is licensed under the MIT license.
 */

// Note that this is a wrapper script that spawns the Shell script deploy.sh
// that does the actual work.

var spawn = require('child_process').spawn;

module.exports = function (name, config) {
  return function (path, callback) {

    var command = '/bin/sh';
    var args = [__dirname + '/deploy.sh', path];
    var options = {
      env: Object.create(config)
    };

    var child = require('child_process').spawn(command, args, options);

    child.stdout.on('data', function (chunk) {
      process.stderr.write(chunk);
    });

    child.stderr.on('data', function (chunk) {
      process.stderr.write(chunk);
    });

    child.on('exit', function (code) {
      callback(code !== 0 && new Error('exit code: ' + code));
    });
  };
};
