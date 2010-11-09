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
    Step = require('../lib/step'),
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

  /* Local properties */
  this.framework;
  this.tasksChain = new Array();

  this.loadNewTaskChain(Tasks);


};

/**
 * Load the all tasks that had been registered in managed_tasks.js.
 */
TaskManager.prototype.loadNewTaskChain = function (Tasks){
var that = this;


  var reversedTasks = Tasks.reverse();
  var i, name, args, first, current, next;

  for (i = 0; i < reversedTasks.length; ++i) {
    args = reversedTasks[i];

    if (args instanceof Array) {
      name = args.shift();  // Entfernt das erste Element, die anderen rŸcken nach.
    } else {
      name = args;
      args = [];
    }


    next = new ManagedTasks[name];
 //   next.apply(this, args);
    //  console.log(require('util').inspect(next, true, null));
       //wendet this.handlers[name] auf das this an
       //und Ÿbergibt args (= verbleibende Handler) als Parameter

    if (first === undefined) {
      first = next;
    } else {
      current.next = next;
    }
    current = next; // wird bei first === undefined auf 'first' gesetzt.
  }
that.tasksChain.push(first);
 //Sconsole.log(require('util').inspect(first, true, null));

    /*
  var reversedTasks = Tasks.reverse();


  reversedTasks.forEach(function(task) {
        if(ManagedTasks[task] === undefined){
          _l.sys.puts("ERROR: cant found Task: '"+task+"' build stopped!");
          process.exit(1);  
        }else{
         var dep = new ManagedTasks['dependency'];
             dep.next = new ManagedTasks['jslint'];
          that.tasksChain.push(new ManagedTasks[task]);
        }
    });

  var dep = new ManagedTasks['dependency'];
      dep.next = new ManagedTasks['jslint'];




     that.tasksChain.push(dep);
*/
   /* Tasks.forEach(function(task) {
        if(ManagedTasks[task] === undefined){
          _l.sys.puts("ERROR: cant found Task: '"+task+"' build stopped!");  
          process.exit(1); /* terminated espresso process! 
        }else{
          that.tasksChain.push(new ManagedTasks[task]);
        }
    });
*/
  // console.log(require('util').inspect(ManagedTasks, true, null));

};

/*
Step(
  function readSelf() {
    fs.readFile(__filename, this);
  },
  function capitalize(err, text) {
    if (err) throw err;
    return text.toUpperCase();
  },
  function showIt(err, newText) {
    if (err) throw err;
    console.log(newText);
  }
);
 */

/**
 * Return the task chain.
 */
TaskManager.prototype.getTaskChain = function (){

  return this.tasksChain;

};
