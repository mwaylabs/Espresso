/*!
 * package.js
 *
 * Command module to package projects
 *
 * Copyright(c) 2011 Panacoda GmbH. All rights reserved.
 * This file is licensed under the MIT license.
 */

// This is a wrapper for the Espresso PhoneGap modules below ../../phonegap/

exports.description = 'Command to build native applications';

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
      packageTargets.forEach(function (target) {

        var command = join(__dirname,'..','..','phonegap','index');
        var args = [];
        var options = {
          cwd: buildDir,
          env: JSON.parse(JSON.stringify(process.env)),
          customFds: [ process.stdin, process.stdout, process.stderr ]
        };

        // adjust the child's environment
        options.env.action = action;
        options.env.target = target;
        options.env.file = join(process.cwd(), 'config.json');
        options.env.phonegap_dir =
          join(__dirname,'..','..','submodules','github','callback','phonegap');

        require('child_process').spawn(command, args, options);
      });
    });
  });
};
