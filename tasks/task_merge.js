// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: 2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      16.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var File = require('../core/file').File;
var Task = require('./task').Task;

/**
 * @class
 * This Task combines all files of a framework, into a single file.
 * The merged files replaces all the several single files in a framework.
 *
 * @extends Task
 */
var Task_Merge = exports.Task_Merge = function () {

  /* Properties */
  this.name = 'merge';
  this.mergedFile = ''; /*The merged output file*/ 
  this.mergedCSSFile = ''; /*The merged output file*/
};

/**
 * @description
 * Get the run() function from Task
 * @param framework
 */
Task_Merge.prototype = new Task();

/**
 * @description
 * Combining all the files, contained in the result of merging process
 * @param framework the reference to the framework this task is working with.
 */
Task_Merge.prototype.duty = function duty(framework, callback) {
  var that = this;
  this.files = [];
  this.notJSfiles = [];

  // Merge all files together
  framework.files.forEach(function (file) {
      if (file.isJavaScript()) {
        //console.log('Merging: ' + file);
        that.mergedFile += '\n' + file.content;
      } else if (file.isStylesheet() && framework.is_a_plugin) {
        that.mergedCSSFile += '\n' + file.content;
        //that.notJSfiles.push(file);
      }
    });

  that.files.push(new File({
        frDelimiter: framework.frDelimiter,
        name: framework.name,
        path: framework.name + '.js',
        containsMergedContent : true,
        framework: framework,
        content: that.mergedFile
      })
  );

  if (framework.is_a_plugin) {
    that.files.push(new File({
          frDelimiter: framework.frDelimiter,
          name: framework.name,
          path: framework.name + '.css',
          containsMergedContent : true,
          framework: framework,
          content: that.mergedCSSFile
        })
    );
  }

  framework.files = that.files;
  callback(framework);
};
