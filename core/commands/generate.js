/*!
 * command module for building a project
 *
 * Copyright(c) 2011 M-Way Solutions GmbH. All rights reserved.
 * MIT and GPL Licensed
 *
 * @author pfleidi
 */

exports.description = 'Command to generate new or additional files for a project';

exports.examples = [
  '--directory myProject',
  '--view=myNewView',
  '-v myOtherView -m myOtherModel -c myOtherController'
];

exports.options = {

  directory: {
    'description': 'Specify a custom project directory',
    'default': '$PWD',
    'hasargument': true
  },

  model: {
    'description': 'Create a new model',
    'hasargument': true
  },

  controller: {
    'description': 'Create a new controller',
    'hasargument': true
  },

  view: {
    'description': 'Create a new page',
    'hasargument': true
  },

  validator: {
    'description': 'Create a new validator',
    'shortoption': 'x',
    'hasargument': true
  },

  i18n: {
    'description': 'Create a new i18n files',
    'hasargument': false
  },

  target: {
    'description': 'Create a new "targets.json" sample file',
    'hasargument': false
  }
};

exports.run = function run(params) {
  var Generator  = require(__dirname + '/../../generator/file_generator');
  if (!(params.model || params.controller
      || params.view || params.validator
      || params.i18n || params.target)) {
      throw new Error('No generation was specified!');
    }
  Generator.generate(params);
};

