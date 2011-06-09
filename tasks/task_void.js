// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      26.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var Task_Void,
    Task = require('./task').Task;
/**
 * @class
 *
 * This is a empty task, which does nothing at all.
 * Every framework must provide al least one Task, so this would be the task if a framework needs
 * no manipulation of it files.
 * 
 * @extends Task
 */
Task_Void = exports.Task_Void = function() {

  /* Properties */
  this.name = 'void';

};

/**
 * @description
 * Get the run() function from Task.
 */
Task_Void.prototype = new Task();

/**
 * @description
 * Void task .... do nothing here.
 */
Task_Void.prototype.duty = function(framework,callback){

    callback(framework);

};