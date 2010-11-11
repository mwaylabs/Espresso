// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      10.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================
var _l = {},
    T3,
    Task = require('./Task').Task;
    File = require('../core/file').File;

/*
 * The required modules for Task_Dependency.
 *
 * sys    = node.js system module
 * fs     = filesystem
 *
 */
_l.sys = require('sys');



T3 = exports.T3 = function() {


  /* Properties */
  this.name = 'T3';

};

/**
 * Get the run() function from Task
 * @param framework
 */
T3.prototype = new Task;


/**
 * The duty of this task.
 * @param framework the reference to the framework this task is working with.
 */
T3.prototype.duty = function(framework) {
var that = this;
_l.sys.puts('Running Task: "'+that.name+'"');
    return framework; //  callback(framework);
};