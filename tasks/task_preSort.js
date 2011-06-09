// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      13.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================



var Task_PreSort,
    Task = require('./task').Task;

/**
 * @class
 * Task to sort the files of framework, according to the demands of The-M-Project« core.
 * This should represent the 'call' hierarchy, which says:
 * - models first
 * - then controllers
 * - then views
 * - and then the rest.
 *
 * This task is meant as pre sorting, before the dependency task resolves the
 * dependencies. If no dependencies are found, the files should be already in the right order,
 * after passing this task.
 *
 * This is a task for the application code only.
 *
 * @extends Task
 */
Task_PreSort = exports.Task_PreSort = function() {
  /* Properties */
  this.name = 'pre sort';
};

/**
 * @description
 * Get the run() function from Task.
 */
Task_PreSort.prototype = new Task();


/**
 * @description
 * The duty of this task
 */
Task_PreSort.prototype.duty = function(framework,callback){
 var that = this,
     _files = framework.files,
     _controllers = [],
     _models      = [],
     _views       = [],
     _misc        = [],
     _sorted      = [];

    _files.forEach(function(file){
        if(file.path.search('/controllers/')!== -1){            
           _controllers.push(file);
        }else if (file.path.search('/views/')!== -1){
            _views.push(file);
         }else if (file.path.search('/models/')!== -1){
            _models.push(file);
        }else{
            _misc.push(file);
        }
    });

   // _models.concat(_controllers,_views,_misc);
  //  _models.concat(_views);
  //  _models.concat(_misc);

     _sorted = _sorted.concat(_models, _controllers, _views,_misc);
    framework.files = _sorted;
    callback(framework);
};