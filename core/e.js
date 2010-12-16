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
    this.__version__ = '0.0.1';  // Espresso version.
};

/**
 * @property
 * Reference to node basic system functions.
 */
E.prototype._l = {};
E.prototype._l.fs = require('fs');
E.prototype._l.sys = require('sys');
E.prototype._l.path = require('path');


/**
 * @property
 * The reference to 'style' -  used to color the console output.
 * https://github.com/chrislloyd/colored.js
 */
E.prototype.style = require('../lib/color');

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
