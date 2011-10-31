/*!
 * package.js
 *
 * Command module to package projects
 *
 * Copyright(c) 2011 Panacoda GmbH. All rights reserved.
 * This file is licensed under the MIT license.
 */

// This is a wrapper for the Espresso PhoneGap modules below ../../phonegap/

exports.description = 'Command package projects';

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
      packageTargets.forEach(function (target) {

        var command = join(__dirname,'..','..','phonegap','index');
        var args = [];
        var options = {
          cwd: buildDir,
          env: JSON.parse(JSON.stringify(process.env))
        };

        // adjust the child's environment
        options.env.action = 'build';
        options.env.target = target;
        options.env.file = join(process.cwd(), 'config.json');
        options.env.phonegap_dir =
          join(__dirname,'..','..','submodules','github','callback','phonegap');

        var child = require('child_process').spawn(command, args, options);

        child.stdout.on('data', function (chunk) {
          process.stderr.write(chunk);
        });

        child.stderr.on('data', function (chunk) {
          process.stderr.write(chunk);
        });

        child.on('exit', function (code) {
        });
      });
    });
  });
};
