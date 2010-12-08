// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      16.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var _l = {},
    Task_Merge,
    File = require('../core/file').File;
    Task = require('./Task').Task;

/*
 * The required modules.
 */
_l.sys = require('sys');
_l.fs = require('fs');


/**
 * @class
 * This Task combines all files of a framework, into a single file.
 * The merged files replaces all the several single files in a framework.
 *
 * @extends Task
 */
Task_Merge = exports.Task_Merge = function() {

  /* Properties */
  this.name = 'merge';
  this.mergedFile = ''; /*The merged output file*/ 

};

/**
 * @description
 * Get the run() function from Task
 * @param framework
 */
Task_Merge.prototype = new Task;

/**
 * @description
 * Combining all the files, contained in the result of merging process
 * @param framework the reference to the framework this task is working with.
 */
Task_Merge.prototype.duty = function(framework,callback){

  var that = this;
  that.files = [];

  /*Merge all files together*/
  framework.files.forEach(function(file){
        if(file.isJavaScript){
            that.mergedFile += file.content;
        }
  });


  that.files.push( new File({
                             frDelimiter: framework.frDelimiter,
                             name: framework.name,
                             path: framework.name+'.js',
                             framework: framework,
                             content: that.mergedFile
                            })

                  );


  framework.files = that.files;

  callback(framework);

};