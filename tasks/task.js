// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      10.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================



/**
 * Definition of Task.
 *
 */


var _l = {},
    Task,
Step = require('../lib/step');
    _l.sys = require('sys');


Task = exports.Task = function() {

  this.framework;
  this.name = 'your task with no name'; /* the name of the task*/
  this.next;  /* the reference to the next task in the chain.*/
    
};

/**
 * The run function, defined here for any task.
 * @param framework the framework, this task is working with
 * @param callback  the function, that should be called after the all tasks finished there job.
 */
Task.prototype.run = function(framework,callback){
var that = this;

    Step(
      function executeSelf() {
        return that.duty(framework);
      },
      function callNextTask(err, fr) {
        if (err){throw err;}
        if (that.next === undefined){
            callback(fr);
        }else{
           that.next.run(fr,callback);
        }
      }
    );

};


/**
 * This function should be overridden by any Task implementation.
 * @param framework the framework, this task is working with
 * @param callback  the function, that should be called after the all tasks finished there job.
 */
Task.prototype.duty = function(framework,callback){

      _l.sys.puts("No duty() function implemented for: '" +this.name + "' !");
      _l.sys.puts("Override the run() function in your tass by writing:\n yourTask.prototype.duty = function(framework,callback){ ... }");

}
