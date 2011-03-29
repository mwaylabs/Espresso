/*!
 * command module for building a project
 * @autor pfleidi
 */


exports.description = 'Command to generate new or additional files for a project';

exports.examples = [
  '--directory myProject'
];

exports.options = {

  page: {
    'description': 'Create a new page',
    'hasargument': true
  },

  controller: {
    'description': 'Create a new controller',
    'hasargument': true
  },

  page: {
    'description': 'Create a new page',
    'hasargument': true
  },

  model: {
    'description': 'Create a new model',
    'hasargument': true
  },

  i18n: {
    'description': 'Create a new i18n file',
    'hasargument': true
  },
  
  target: {
    'description': 'Create a new "targets.json" sample file',
    'hasargument': true
  }
};

exports.run = function run(params) {
  console.dir(params);
};

