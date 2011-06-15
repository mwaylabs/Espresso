// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      10.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var  E = require('../core/e').E;

/**
 * @class
 * 
 * The Task prototype. This is the prototype of every task used in Espresso.
 * This prototype is definition of the core feature of a task.
 *
 * @extends E
 *
 */
var Task = exports.Task = function() {
  this.framework; /* reference to the framework*/
  this.name = 'your task with no name'; /* the name of the task*/
  this.next;  /* the reference to the next task in the chain.*/
};

/*
 * Getting all basic Espresso functions from the root prototype: M
 */
Task.prototype = new E();

/**
 * @description 
 * The run function, defined here for any task.
 * Execute the duty function of this task first, then pass the framework object forward to the next task.
 * If no next task is defined, we reached the end of the task chain.
 * Execute the callback (that should be called after the build finishes) instead.
 * If a next task is defined, call its run function, and pass over the framework object and the callback,
 * that should be called when the build is done.
 *
 * @param framework {object}, the framework, this task is working with
 * @param callback {function} the function, that should be called after the all tasks finished there job.
 * The framework in callback may be modified by the duty() function.
 */
Task.prototype.run = function(framework, callback){
  var that = this;

  if (that.isReadyToRun(framework)) {
    that.duty(framework, function(fr) {
      if (that.next === undefined) {
        // mark framework as built whe the task chain is finished
        if (!framework.app.globalState.builtFrameworks) {
          framework.app.globalState.builtFrameworks = {};
        };
        framework.app.globalState.builtFrameworks[framework.name] = true;

        callback(fr);
      } else {
        that.next.run(fr, callback);
      };
    });
  } else {
    // Suspend task chain, as there are unsatisfied conditions, i.e. other
    // tasks have run to completion first.  We'll re-check this task's
    // condition next loop around the event loop.
    process.nextTick(function () {
      that.run(framework, callback);
    });
  };
};


/**
 * @description
 * This function should be overridden by any Task implementation.
 * The duty() function contains the implementation of the action, provided by this task.
 * @param framework  {object} the framework, this task is working with
 * 
 * @param callback {function} the function, that should be called after the all tasks finished there job.
 */
Task.prototype.duty = function(framework,callback){
  this._e_.sys.puts("No duty() function implemented for: '" +this.name + "' !");
  this._e_.sys.puts("Override the duty() function in your task by writing:\n yourTask.prototype.duty = function(framework,callback){ ... }");
  callback();  
};

/**
 * @description
 * This function returns whether a task is ready to be run.  If it returns
 * false, then there are unmet conditions, that has to be satisfied first.
 *
 * Tasks that run conditionally should override this function.
 *
 * By default tasks can be run unconditionally.
 *
 * @param framework {object}, the framework, this task is working with.
 * @returns {boolean} true if the task can be run, false otherwise.
 */
Task.prototype.isReadyToRun = function (framework) {
  return true;
};
