/*!
 * command module for building a project
 * @autor pfleidi
 */


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
  console.dir(params);
};
