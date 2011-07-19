/*!
 * deploy/ftp/index.js
 *
 * Espresso FTP deployment module.
 *
 * Copyright(c) 2011 Panacoda GmbH. All rights reserved.
 * This file is licensed under the MIT license.
 */

// Note that this is a wrapper script that spawns the Python script deploy.py
// that does the actual work.

// TODO native node.js FTP deployment

var spawn = require('child_process').spawn;

module.exports = function (name, config) {
  return function (path, callback) {

    var command = 'python';
    var args = [__dirname + '/deploy.py', path];
    var options = {
      cwd: path, // is there any better place?
      env: Object.create(config)
    };

    // adjust the child's environment
    options.env.PYTHONUNBUFFERED = 1;

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
