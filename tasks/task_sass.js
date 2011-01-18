// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      17.01.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var Task_SASS,
    sass = require('../lib/sass'),
    Task = require('./Task').Task;

/**
 * @class
 *
 * This task compiles a SASS file into a valid CSS file.
 *
 * @extends Task
 */
Task_SASS = exports.Task_SASS = function() {

  /* Properties */
  this.name = 'sass';

};

/**
 * @description
 * Get the run() function from Task.
 */
Task_SASS.prototype = new Task;

/**
 * @description
 * compile a .sass file into a .css file.
 */
Task_SASS.prototype.duty = function(framework,callback){
var that = this;

 if(framework.sassStyleSheets){
  framework.sassStyleSheets.forEach(function(file){
       if(file.isSASS_Stylesheet()){
         file.content = sass.render(''+file.content);
         framework.files.push(file);
       }
    });

   }
    callback(framework);
};