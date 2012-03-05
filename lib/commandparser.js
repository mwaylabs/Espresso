/*!
 * command line parser with subcommands
 * @author pfleidi
 *
 */

var Fs = require('fs');
var Util = require('util');
var Subcommand = require('./subcommand');
var spaces = '               ';


var create = exports.create = function (moduleDir, name) {
  var commands = {};

  function showHelp() {
    Util.puts('Usage: ' + name + ' <command> [<options>]');
    Util.puts('Available commands:');

    Object.keys(commands).forEach(function (command) {
        var space = spaces.slice(command.length);
        Util.puts('   ' + command + space + commands[command].description);
      });
  }

  var help = {
    description: 'Command to show help for a subcommand',

    showHelp: function () {
      Util.puts('Usage: ' + name + ' help <subcommand>');
    },

    dispatch: function (args) {
      var cmd = args.shift();
      var command = commands[cmd];

      if (command) {
        command.showHelp();
      } else if (cmd) {
        Util.puts('No help avalable for command: ' + cmd);
        showHelp();
      } else {
        showHelp();
      }
    }
  };

  function getPluginName(fileName) {
    return fileName.split('.')[0];
  }

  function loadCommands() {
    Fs.readdirSync(moduleDir).forEach(function (file) {
        if (/\.js$/.test(file)) {
          var moduleName = getPluginName(file);
          var module = require(moduleDir + moduleName);
          module.name = module.name || moduleName;
          commands[module.name] = Subcommand.create(name, module);
        }
      });
    commands.help = help;
  }

  function dispatch(args) {
    var cmd = args.shift();
    var command = commands[cmd];

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
