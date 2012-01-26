/*!
 * command module for initializing a new project
 * @autor pfleidi
 */


exports.description = 'Command line tool to generate a new project';

exports.examples = [
  '--project myNewProject',
  '--project myNewProject --directory ~/projects/ --example',
  '-p myNewProject -d ~/projects/ -e',
  '--config ~/path/to/custom_config.json'
];

exports.options = {

  project: {
    'description': 'Project name',
    'hasargument': true,
    'required': true
  },

  directory: {
    'description': 'Specify a custom projects directory',
    'default': '$PWD',
    'hasargument': true
  },

  example: {
    'description': 'Generate an example "Hello World" application',
    'default': false
  },

  config: {
    'description': 'Merge your custom config.json into the default configuration',
    'default': false
  }

};

exports.run = function run(params) {
  var Generator  = require(__dirname + '/../../generator/project_generator');
  Generator.generate(params);
};
