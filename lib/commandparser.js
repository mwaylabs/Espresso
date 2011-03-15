/*!
 * command line parser with subcommands
 * @author pfleidi
 *
 */

//TODO: consistent color scheme

var Fs = require('fs');
var Util = require('util');
var Subcommand = require('./subcommand');
var spaces = '               ';


var create = exports.create = function (moduleDir, name) {
  var commands = {};

  function getPluginName(fileName) {
    return fileName.split('.')[0];
  }

  function loadCommands() {
    Fs.readdirSync(moduleDir).forEach(function (file) {
        if (/\.js$/.test(file)) {
          var name = getPluginName(file);
          var module = require(moduleDir + name);
          commands[name] = Subcommand.create(module);
        }
      });
  }

  function showHelp() {
    Util.puts('Usage: ' + name + ' <command> [<args>]');
    Util.puts('Available commands:');

    Object.keys(commands).forEach(function (command) {
        var space = spaces.slice(command.length);
        Util.puts('   ' + command + space + commands[command].description);
      });
  }

  function dispatch(args) {
    var cmd = args.shift();
    var command = commands[cmd];
    var options;

    if (command) {
      command.dispatch(args);
    } else {
      if (cmd) {
        Util.puts('Unkown command: ' + cmd);
      }
      showHelp();
    }
  }

  loadCommands();

  // return the API
  return {
    dispatch: dispatch
  };

};
