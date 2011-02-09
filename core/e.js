// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      15.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var E;


/**
 * @class
 * The root prototype in Espresso.
 * The prototype for any prototype and object, used in Espresso
 * This prototype defines all the basic properties and implements basic functions,
 * needed by any Espresso prototype or object.
 *
 * @constructor
 */
E = exports.E = function() {
    this.__version__ = '0.0.8-1';  // Espresso version.
};

/**
 * @property
 * Reference to node basic node.js system functions.
 */
E.prototype._e_ = {};
E.prototype._e_.fs = require('fs');
E.prototype._e_.sys = require('sys');
E.prototype._e_.path = require('path');


/**
 * @function
 * The reference to 'style' -  used to color the console output.
 * https://github.com/chrislloyd/colored.js
 */
E.prototype.style = require('../lib/color');

/**
 * @function
 * Reference to Step, used for organize the code, if used a lot of callback
 * stuff.
 *
 * @example
 * 
 * self.sequencer(
 *      function A(){
 *        do something at first here,
 *      },
 *      function B(err,obj){
 *        do something after A here.
 *      },
 *      function C(err){
 *        do something at the and of the sequence
 *      }
 *  );
 *
 */
E.prototype.sequencer =  require('../lib/step');

/**
 * @property
 * The reference to the logger object.
 * Espresso is using the "node-logger" framework.
 * https://github.com/igo/node-logger
 *
 * @example
 * logger.info(Info message);
 * logger.debug('Debug message');
 * logger.warn('Warning message');
 * logger.error('Error message');
 * logger.trace('Trace message');
 */
E.prototype.logger = require('../lib/node-logger').logger(module,true);

/**
 * @property
 * Using the 'optimist' framework, for parsing the arguments.
 * https://github.com/substack/node-optimist
 */
E.prototype.argv = require('../lib/optimist').argv;

/**
 * @function
 * Prints the current version number of Espresso.
 */
E.prototype.printVersionNumber = function(){
  console.log('Espresso, version: '+this.__version__);
};

/**
 * @description
 * Test ist the given path is a valid directory or file.
 * @param path {string} the path to test.
 * @return {boolean} return true if the given path is valid, false otherwise.
 */
E.prototype.touchPath = function (path){
  try{
    this._e_.fs.statSync(path);
    return true;
  }catch(ex){
    return false
  }
};