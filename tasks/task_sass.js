// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: 2011 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      17.01.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var Sass = require('../node_modules/sass');
var Task = require('./task').Task;

/**
 * @class
 *
 * This task compiles a SASS file into a valid CSS file.
 *
 * @extends Task
 */
var Task_SASS = exports.Task_SASS = function () {
  this.name = 'sass';
};

/**
 * @description
 * Get the run() function from Task.
 */
Task_SASS.prototype = new Task();

/**
 * @description
 * compile a .sass file into a .css file.
 */
Task_SASS.prototype.duty = function (framework, callback) {
  var that = this;

  if (framework.sassStyleSheets) {
    framework.sassStyleSheets.forEach(function (file) {
        if (file.isSASS_Stylesheet()) {
          file.content = Sass.render('' + file.content);
          framework.files.push(file);
        }
      });

  }
  callback(framework);
};
