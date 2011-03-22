/*!
 * command module for development server
 * @autor pfleidi
 */


exports.description = 'Development server to compile and run the application for testing business in a webbrowser';

exports.name = 'server';

exports.examples = [
  'server',
  'server --port 8080',
  'server -m --p 2342 --config config.json'
];

exports.options = {

  manifest: {
    'description': 'Start the server in manifest mode. Enable generation of cache.manifest',
    'default': false
  },

  config: {
    'description': 'Specify a custom config',
    'hasargument': true
  },

  port: {
    'description': 'Specify a custom port',
    'default': 8000,
    'hasargument': true
  }

};

exports.run = function run(params) {
  console.dir(params);
};
