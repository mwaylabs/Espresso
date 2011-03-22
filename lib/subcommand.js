/*!
 * subcommand parser
 * @author pfleidi
 *
 * command line parser inspired by https://github.com/substack/node-optimist
 */


// TODO: usage generator
// TODO: error handling
// TODO: implement modules

var Util = require('util');
var spaces = '               ';

var create = exports.create = function (command) {

  /**
   * Parse commandline arguments into an object
   *
   * @param args {Array}
   * @return {Object}
   * @API private
   */ 
  function parseArgs(args) {
    var params = {};
    var key;

    for (var i = 0; i < args.length; i += 1) {
      var arg = args[i];

      // --command=value
      if (arg.match(/^--.+=/)) {
        var m = arg.match(/^--([^=]+)=(.*)/);
        params[m[1]] = m[2];
      }

      // --command value
      else if (arg.match(/^--.+/)) {
        key = arg.match(/^--(.+)/)[1];
        var nextLong = args[i + 1];
        if (nextLong && !nextLong.match(/^-/)) {
          params[key] = nextLong;
          i += 1;
        } else {
          params[key] = true;
        }
      }

      // -casdf value
      else if (arg.match(/^-[^-]+/)) {

        // -asdf
        arg.slice(1, -1).split('').forEach(function (letter) {
            params[letter] = true;
          });

        key = arg.slice(-1)[0];
        var nextShort = args[i + 1];

        // -f value
        if (nextShort && !nextShort.match(/^-/)) {
          params[key] = nextShort;
          i += 1;
        } else {
          params[key] = true;
        }
      } 
    }

    return params;
  }

  function genParams(args) {
    var parsed = parseArgs(args);
    var cmdParams = command.parameters;
    var params = {};

    Object.keys(cmdParams).forEach(function (param) {
        if (parsed[param]) {
          params[param] = parsed[param];
        } else if (parsed[param[0]]) {
          params[param] = parsed[param[0]];
        } else if (typeof cmdParams[param].default !== 'undefined') {
          params[param] = cmdParams[param].default;
        } else if (cmdParams[param].required) {
          throw new Error('Missing parameter: ' + param);
        }
      });

    return params;
  }

  function showHelp() {
    //TODO: implement me
  }

  function dispatch(args) {
    try {
      var options = genParams(args, command.parameters);
      command.run(options);
    } catch (ex) {
      Util.puts(ex.message);
      showHelp();
    }
  }

  return {
    dispatch: dispatch,
    description: command.description,
    showHelp: showHelp
  };

};


