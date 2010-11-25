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
    Step = require('../lib/step'),
    Task = require('./Task').Task;

/*
 * The required modules.
 */
_l.sys = require('sys');
_l.fs = require('fs');



Task_Merge = exports.Task_Merge = function() {

  /* Properties */
  this.name = 'merge';
  this.mergedFile = '/**/'; /*The merged output file*/ 

};

/**
 * Get the run() function from Task
 * @param framework
 */
Task_Merge.prototype = new Task;

/**
 * Combining all the files, contained in the result of merging process
 * @param framework the reference to the framework this task is working with.
 */
Task_Merge.prototype.duty = function(framework,callback){
var that = this;
    _l.sys.puts('Running Task: "merge"');


  var _outputPath = framework.app.execPath+'/'+framework.app.outputFolder;

  framework.files.forEach(function(file){
        if(file.isJavaScript){
            that.mergedFile += file.content;
        }
  });


 var _FileMerger = function(framework, callback) {
    var that = this;


    that._folderCounter = 1;
  //  _l.sys.puts(framework.name+" -> framework.files.length "+that._resourceCounter);
    that.callbackIfDone = function() {
      if (that._folderCounter === 0){
          callback(framework);
      }
    };

    that.merge = function(mergedFile) {

    if(that._folderCounter >=1){
     if(mergedFile !== undefined){
      _l.fs.writeFile(_outputPath+'/'+framework.app.buildVersion+'/'+framework.name+'.js', mergedFile,
              function(err){
                if(err) {throw err}
                that._folderCounter--;
                that.merge(mergedFile);
              });

         }

     }
      that.callbackIfDone();
    }



 };

 new _FileMerger(framework, callback).merge(that.mergedFile);

};