// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      26.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var Task_Void,
    Task = require('./Task').Task;


Task_Void = exports.Task_Void = function() {

  /* Properties */
  this.name = 'void';

};

/**
 * Get the run() function from Task
 * @param framework
 */
Task_Void.prototype = new Task;

/**
 * Void task .... do nothing here.
 */
Task_Void.prototype.duty = function(framework,callback){

    callback(framework);

};