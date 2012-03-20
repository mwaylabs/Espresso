/*!
 * package.js
 *
 * This command is a wrapper for the Espresso package component to build
 * and run (simulate / emulate) native applications.
 *
 * Copyright(c) 2011 Panacoda GmbH. All rights reserved.
 * This file is licensed under the MIT license.
 */

exports.description = 'Command to build native applications';

exports.usage = ('Usage: espresso package <action> [<target>]'
+ '\n'
+ '\nAvailable actions:'
+ '\n   run                         Build and run project in emulator.'
+ '\n   build                       Build native application package.'
+ '\n'
+ '\nAvailable targets:'
+ '\n   any property-key of package in your config.json; default: "default"'
+ '\n'
);

exports.examples = [
  '--directory myProject'
];

exports.options = {
  directory: {
    'description': 'Specify a custom project directory',
    'default': '$PWD',
    'hasargument': true
  }
};

exports.run = function (options, positional) {

  var action = positional[0]; positional = positional.slice(1);

  if (['build', 'run'].indexOf(action) < 0) {
    throw new Error('Error: bad package action: ' + JSON.stringify(action));
  };

  var app = new (require('../app').App)(options);
  app.loadTheApplication();
  app.loadTheMProject();

  app.build(function () {
    app.saveLocal(function () {

      // TODO get buildDir from some authoritative place
      var buildDir = [
        app.applicationDirectory, app.outputFolder, app.buildVersion
      ].join('/');

      if (positional.length === 0) {
        positional = [ 'default' ];
      };

      var packageTargets = positional;

      var spawn = require('child_process').spawn;
      var join = require('path').join;
      var createWriteStream = require('fs').createWriteStream;
      packageTargets.forEach(function (target) {

        var command = join(__dirname,'..','..','package','index');
        var args = [];
        var log_filename = join(buildDir, 'package.log')
        var logger = (function () {
          var log = createWriteStream(log_filename);
          return function (data) {
            log.write(data);
            process.stderr.write('.');
          }
        })();
        var options = {
          cwd: buildDir,
          env: JSON.parse(JSON.stringify(process.env)),
          customFds: [ 0, -1, -1 ]
        };

        // adjust the child's environment
        options.env.action = action;
        options.env.target = target;
        options.env.file = join(process.cwd(), 'config.json');
        options.env.applicationDirectory = app.applicationDirectory;

        process.stderr.write('package ' + action);
        var child = require('child_process').spawn(command, args, options);
        child.stdout.on('data', logger);
        child.stderr.on('data', logger);
        child.on('exit', function logger_finalize (code) {
          if (code === 0) {
            process.stderr.write(' done\n');
          } else {
            process.stderr.write(' fail\n'
              + 'For more information see ' + log_filename + '\n');
          };
        });
      });
    });
  });
};
