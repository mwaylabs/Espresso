/*!
 * command module for building a project
 *
 * Copyright(c) 2011 M-Way Solutions GmbH. All rights reserved.
 * MIT and GPL Licensed
 *
 * @author pfleidi
 */


// TODO: Add switch for JSLint
// TODO: Add switch for minifier

exports.description = 'Command to build a project';

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

exports.run = function run(params) {
  var params = params || {};
  var App = require('../app').App;
  var app = new App(params);
  app.loadTheApplication();
  app.loadTheMProject();

  app.build(function (options) {
      app.saveLocal(params.onFinish);
    });
};
