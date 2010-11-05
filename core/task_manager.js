// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      05.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


/**
 * Definition of Task Manager
 *
 */


var _l = {},
    TaskManager,
    Task_Dependencies = require('../tasks/dependencies').Task_Dependencies,
    File = require('../core/file').File;

/*
 * The required modules for Task_Dependencies.
 *
 * sys    = node.js system module
 * fs     = filesystem
 *
 */
_l.fs = require('fs');
_l.sys = require('sys');



TaskManager = exports.TaskManager = function() {


  /* Properties */

  /* Local properties */
  this.framework;
  this.name = 'dependencie_task';
  this.tasksChain = new Array();  

  this.loadTasks();


};


TaskManager.prototype.loadTasks = function (){

    var task = new Task_Dependencies();
    this.tasksChain.push(task);

};


TaskManager.prototype.getTaskChain = function (){

  return this.tasksChain;

};
