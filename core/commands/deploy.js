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

      if (positional.length === 0 && 'defaultDeployTarget' in app) {
          if (typeof app.defaultDeployTarget === 'string') {
            positional = [ app.defaultDeployTarget ];
            var useDefaultDeployTarget = true;
          } else throw new Error(
            'Your <config.json>["defaultDeployTarget"] '
            + JSON.stringify(app.defaultDeployTarget)
            + ' is made of stupid!'
          );
      };

      var deployTargets = positional;

      var configs = {};
      deployTargets.forEach(function (target) {
        var config = app.deploy;

        // TODO we could synthesize arbitrary precise error descriptions here
        if (!(config instanceof Object) ||
            !(config[target] instanceof Object) ||
            !(config[target][config[target].method] instanceof Object) ||
            false) throw new Error(
          'Your <config.json>["deploy"]['
          + JSON.stringify(target)
          + ']'
          + (config instanceof Object &&
             config[target] instanceof Object &&
             typeof config[target].method === 'string'
            ? '[' + JSON.stringify(config[target].method) + ']'
            : '')
          + ' is made of stupid!'
        );

        var method = config[target].method;
        config = JSON.parse(JSON.stringify(config[target][method]));
        config.method = method;
        config.target = target;
        configs[target] = config;
      });

      var modules = {};
      deployTargets.forEach(function (target) {
        var method = configs[target].method;
        var module = modules[target] = require('../../deploy/' + method);
      });

      // instantiate deployment methods
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
        config.LOGNAME = process.env.LOGNAME;
        var handler = handlers[target];
        process.stdout.write(
          'deploy '
          + config.target
          + (useDefaultDeployTarget ? ' (default)' : '')
          + ' via '
          + config.method
        );
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
