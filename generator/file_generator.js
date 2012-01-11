// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2011 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


/*
 * dependencies
 */
var Fs = require('fs');
var Sequencer = require('step');
var File = require('../core/file').File;
var Renderer = require('../lib/renderer');
var Utils = require('../lib/espresso_utils');

var generate = exports.generate = function generate(options) {
  var espressoPath = __dirname + '/..';
  var templatePath = __dirname + '/templates';   
  var templateRenderer = Renderer.createRenderer(templatePath);
  var config = Utils.readConfig(options.directory);
  var dispatcher = {};
  var port = options.port;


  /**
   * Generate new file of specific type
   *
   * @param {String} type
   * @param {String} name
   * @return {undefined}
   * @api private
   */
  function genericGenerate(type, templateFile, name, port) {
    var directory = options.directory + '/app/' + type + '/';
    var outputPath = directory + name + '.js';
    var callback = function callback(err) {
      if (err) {
        Utils.logErr(err);
      }
    };

    var ctx = {
      name: name,
      appName: config.name,
      port: port
    };

    Fs.mkdir(directory, 0755, function (err) {
        if (err) {
          if (err.code === 'EEXIST') {
            // ok: directory already exists; that's what we want!
          } else {
            // Note: this is the old code for <node-0.6
            // errno 17: folder already exists
            if (err.errno !== 17) {
              throw err;
            }
          };
        }

        templateRenderer.render({
            templateFile: templateFile,
            ctx: ctx,
            outputPath: outputPath,
            callback: callback
          });

        });
  }

  /**
   * Generate new target file
   *
   * @param {String} outputPath
   * @param {Function} callback
   * @return {undefined}
   * @api private
   */
  dispatcher.generateTarget = function generateTarget() {
    var templateFile = 'targets.json';
    var callback = function callback(err) {
      if (err) {
        Utils.logErr(err);
      }
    };

    var ctx = {
      appName: config.name
    };

    templateRenderer.render({
        templateFile: templateFile,
        ctx: ctx,
        outputPath: options.directory + '/targets.json',
        callback: callback
      });
  };

  /**
   * Generate new model file
   *
   * @param {String} modelName 
   * @return {undefined}
   * @api private
   */
  dispatcher.generateModel = function generateModel(modelName) {
    genericGenerate('models', 'model.js', modelName);
  };

  /**
   * Generate new view file
   *
   * @param {String} viewName 
   * @return {undefined}
   * @api private
   */
  dispatcher.generateView = function generateView(viewName) {
    genericGenerate('views', 'view.js', viewName);
  };

  /**
   * Generate new controller file
   *
   * @param {String} controllerName 
   * @return {undefined}
   * @api private
   */
  dispatcher.generateController = function generateController(controllerName) {
    genericGenerate('controllers', 'controller.js', controllerName);
  };

  /**
   * Generate new validator file
   *
   * @param {String} validatorName 
   * @return {undefined}
   * @api private
   */
  dispatcher.generateValidator = function generateValidator(validatorName) {
    genericGenerate('validators', 'validator.js', validatorName);
  };

  /**
   * Generate new i18n file
   *
   * @param {String} i18nName
   * @return {undefined}
   * @api private
   */
  dispatcher.generateI18n = function generateI18n() {
    genericGenerate('resources/i18n', 'de_de.js', 'de_de');
    genericGenerate('resources/i18n', 'en_us.js', 'en_us');
  };

  /**
   * Generate socket-server
   *
   * @param {String} serverName
   * @param {Integer} port
   * @return {undefined}
   * @api private
   */
  dispatcher.generateSockserver = function generateSocketServer(serverName) {
    genericGenerate('../', 'socket-server.js', serverName, port);
    Utils.log('Run the server with: "node '+serverName+'.js"');
  };

  /**
   * NOP-function so that file-generator must not be modified
   * to add customized port in socket-server-generation
   */
  dispatcher.generatePort = function generatePort(){};

  (function dispatchOperations() {
      Object.keys(options).forEach(function (operation) {
          if (operation !== 'directory' && operation !== 'help') {
            var opName = operation.charAt(0).toUpperCase() + operation.substring(1);
            dispatcher['generate' + opName](options[operation]);
          }
        });
    }());

};