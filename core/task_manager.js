// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      05.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var E = require('./e').E,
    TaskManager,
    ManagedTasks = require('../tasks/managed_tasks').ManagedTasks.Tasks,
    File = require('../core/file').File;


/**
 * @class
 *
 * Definition of Task Manager prototype.
 * The TaskManager is responsible for building a chain of tasks specified in a config file.
 * The TaskManager queues the tasks up, and takes care of the task execution chain.
 * Which means hooking up the Tasks, so they can execute themselves and pass the result to next Task.
 *
 * @param Tasks, the task that the manager should hook up.
 *
 * @extends E
 *
 * @constructor
 */
TaskManager = exports.TaskManager = function(Tasks) {
  /* Properties */
  this.tasksChain = [];

  if(Tasks !== undefined){
    this.loadNewTaskChain(Tasks);
  }
};


/*
 * Getting all basic Espresso functions from the root prototype: M
 */
TaskManager.prototype = new E();

/**
 * Load the all tasks that had been registered in managed_tasks.js.
 * @param Task the task defined in the managed_tasks.js.
 */
TaskManager.prototype.loadNewTaskChain = function (tasks){
var that = this,
    _i,
    _firstTask,
    _current,
    _nextTask;

   for (_i = 0; _i < tasks.length; ++_i) {
     if(!ManagedTasks[tasks[_i]]){
         that._e_.sys.puts("ERROR: Task '"+tasks[_i]+"' not found! ");
         that._e_.sys.puts("Hint: make sure, the task is defined and has an entry in /tasks/managed_tasks.js");
         that._e_.sys.puts("Hint: check spelling");
         process.exit(1); /* exit the process, reason: task not found!*/
     }else{
       _nextTask = new ManagedTasks[tasks[_i]];

       if (_firstTask === undefined) {
         _firstTask = _nextTask;
       } else {
         _current.next = _nextTask;
       }
       _current = _nextTask;
     }     
   }
   if(_firstTask){
       that.tasksChain.push(_firstTask);
   }else{
     that._e_.sys.puts("ERROR: No Task defined");
     process.exit(1); /* exit the process, reason: not task was defined*/
   }
};

/**
 * Returning the hooked-up task of a Task Manager.
 * @return the first element of the task chain.
 */
TaskManager.prototype.getTaskChain = function (){
  if(this.tasksChain[0]){
    return this.tasksChain[0];
  }
};
