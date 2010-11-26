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
    ManagedTasks = require('../tasks/managed_tasks').ManagedTasks.Tasks,
    File = require('../core/file').File;

/*
 * The required modules for Task Manager.
 *
 * sys    = node.js system module
 * fs     = filesystem
 *
 */
_l.fs = require('fs');
_l.sys = require('sys');



TaskManager = exports.TaskManager = function(Tasks) {


  /* Properties */
  this.tasksChain = new Array();

  if(!(Tasks === undefined)){
    this.loadNewTaskChain(Tasks);
  }

};

/**
 * Load the all tasks that had been registered in managed_tasks.js.
 * @param Task the task defined in the managed_tasks.js.
 */
TaskManager.prototype.loadNewTaskChain = function (Tasks){
var that = this;

  if(!(Tasks === undefined)){

    var i, firstTask, current, nextTask;

    for (i = 0; i < Tasks.length; ++i) {

      if(!ManagedTasks[Tasks[i]]){
          _l.sys.puts("ERROR: Task '"+Tasks[i]+"' not found! ");
          _l.sys.puts("Hint: make sure, the task is defined and has an entry in /tasks/managed_tasks.js");
          _l.sys.puts("Hint: check spelling");
          process.exit(1); /* exit the process, reason: task not found!*/
      }else{

        nextTask = new ManagedTasks[Tasks[i]];
      
        if (firstTask === undefined) {
          firstTask = nextTask;
        } else {
          current.next = nextTask;
        }
        current = nextTask;
     }     
  }
   if(firstTask){
       that.tasksChain.push(firstTask);
   }else{
     _l.sys.puts("ERROR: No Task defined");
     process.exit(1); /* exit the process, reason: not task was defined*/
   }

  }
};

/**
 * Return the task chain.
 */
TaskManager.prototype.getTaskChain = function (){

  return this.tasksChain[0];

};
