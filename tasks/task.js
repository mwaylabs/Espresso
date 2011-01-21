// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      10.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var  E = require('../core/e').E,
     Task;

/**
 * @class
 * 
 * The Task prototype. This is the prototype of every task used in Espresso.
 * This prototype is definition of the core feature of a task.
 *
 */
Task = exports.Task = function() {

  this.framework; /* reference to the framework*/
  this.name = 'your task with no name'; /* the name of the task*/
  this.next;  /* the reference to the next task in the chain.*/
    
};

/*
 * Getting all basic Espresso functions from the root prototype: M
 */
Task.prototype = new E;

/**
 * @description
 * Adding the TaskSequencer to Task definition, any Task that uses this object as prototype
 * getting access to tha TaskSequencer.
 * @property
 */
Task.prototype.TaskSequencer = require('../lib/sequencer');

/**
 * @description 
 * The run function, defined here for any task.
 * Execute the duty function of this task first, then pass the framework object forward to the next task.
 * If no next task is defined, we reached the end of the task chain.
 * Execute the callback (that should be called after the build finishes) instead.
 * If a next task is defined, call its run function, and pass over the framework object and the callback,
 * that should be called when the build is done.
 * @param framework the framework, this task is working with
 * @param callback the function, that should be called after the all tasks finished there job.
 * The framework in callback may be modified by the duty() function.
 */
Task.prototype.run = function(framework,callback){
var that = this;

  that.duty(framework,function(fr){
    if (that.next === undefined){
      callback(fr);
    }else{
      that.next.run(fr,callback);
    }
  });
    
};


/**
 * @description
 * This function should be overridden by any Task implementation.
 * The duty() function contains the implementation of the action, provided by this task.
 * @param framework the framework, this task is working with
 * @param callback  the function, that should be called after the all tasks finished there job.
 */
Task.prototype.duty = function(framework,callback){
  this._e_.sys.puts("No duty() function implemented for: '" +this.name + "' !");
  this._e_.sys.puts("Override the duty() function in your task by writing:\n yourTask.prototype.duty = function(framework,callback){ ... }");
  callback();  
};
