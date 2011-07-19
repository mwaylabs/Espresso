/*!
 * deploy.js
 *
 * Command module to deploy projects
 *
 * Copyright(c) 2011 Panacoda GmbH. All rights reserved.
 * This file is licensed under the MIT license.
 */

// This is a wrapper for the Espresso deployment modules below ../../deploy/

exports.description = 'Command deploy projects';

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
      // TODO validateBuildDir(buildDir)

      var deployTargets = positional;
      // TODO validateDeployTargets(deployTargets)

      var configs = {};
      deployTargets.forEach(function (target) {
        var config = JSON.parse(JSON.stringify(app.deploy[target]));
        // TODO validateDeployConfig(config);
        var method = config.method;
        config = config[method];
        config.method = method;
        config.name = target;
        configs[target] = config;
      });

      var modules = {};
      deployTargets.forEach(function (target) {
        var method = configs[target].method;
        var module = modules[target] = require('../../deploy/' + method);
        // TODO? validateDeployModule(module);
      });

      var handlers = {};
      deployTargets.forEach(function (target) {
        handlers[target] = modules[target](target, configs[target]);
      });

      // TODO continue even if we've got 0 handlers
      var count = deployTargets.length;
      var successful = [];
      var failed = [];
      deployTargets.forEach(function (target) {
        var config = configs[target];
        var handler = handlers[target];
        console.log('deploy ' + config.name + ' via ' + config.method + '...');
        handler(buildDir, function (error) {
          if (error) {
            console.error(target + ': ' + error);
            failed.push(target);
          } else {
            successful.push(target);
          };
          if (--count === 0) {
            if (failed.length > 0) {
              console.log('failed to deploy ' + failed.join(', '));
            };
            if (successful.length > 0) {
              console.log('successfully deployed ' + successful.join(', '));
            } else {
              console.log('nothing deployed successfully');
            };
          };
        });
      });
    });
  });
};
