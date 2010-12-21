// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      29.10.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var Espresso;

/**
 * @class
 * @description
 * ESPRESSO
 *
 * Definition for all espresso related functions.
 * Each file using espresso or parts of it, should include espresso.js via 'require('<path/to/this/file>');.
 *
 * @constructor
 */
Espresso = exports.Espresso = function () {};

/**
 * @property
 * The reference to the development server, build-in in Espresso.
 */
Espresso.Server = require('./server').Server;

/**
 * @property
 * The Reference to the App, representing a concrete application
 * to be build with Espresso. 
 */
Espresso.App = require('./app').App;






 


