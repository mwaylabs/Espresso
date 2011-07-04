// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      15.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


/**
 * @class
 * The root prototype in Espresso.
 * The prototype for any prototype and object, used in Espresso
 * This prototype defines all the basic properties and implements basic functions,
 * needed by any Espresso prototype or object.
 *
 * @constructor
 */
var E = exports.E = function() {
    this.__version__ = JSON.parse(require('fs')
        .readFileSync(__dirname + '/../package.json')).version;
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
E.prototype.sequencer = require('step');

/**
 * @function
 * Prints the current version number of Espresso.
 */
E.prototype.printVersionNumber = function () {
  console.log('Espresso ' + this.__version__);
};

/**
 * @description
 * Test ist the given path is a valid directory or file.
 * @param path {string} the path to test.
 * @return {boolean} return true if the given path is valid, false otherwise.
 */
E.prototype.touchPath = function (path){
  try {
    this._e_.fs.statSync(path);
    return true;
  } catch (ex){
    return false
  }
};
