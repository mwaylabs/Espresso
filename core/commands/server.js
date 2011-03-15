/*!
 * command module for development server
 * @autor pfleidi
 */


exports.description = 'Development server to compile and run the application for testing business in a webbrowser';

exports.examples = [
  'server',
  'server --port 8080',
  'server -m --p 2342 --config config.json'
];

exports.parameters = {

  manifest: {
    'description': 'Start the server in manifest mode. Enable generation of cache.manifest',
    'example': '--manifest',
    'default': false
  },

  config: {
    'description': 'Specify a custom config',
    'example': '--config /path/to/config.json'
  },

  port: {
    'description': 'Specify a custom port',
    'example': '--port 8080',
    'default': 8000
  }

};

exports.run = function run(params) {
  console.dir(params);
};
