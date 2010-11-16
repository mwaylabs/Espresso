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
  this.mergedFile = ''; /*The merged output file*/

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
Task_Merge.prototype.duty = function(framework){
var that = this;
var _outputPath = framework.execPath+'/'+framework.outputFolder+'/'+framework.buildVersion;
_l.sys.puts('Running Task: "merge"');
    framework.files.forEach(function(file){
            /*Putting all file contents together.*/
            that.mergedFile += file.content;
         });
   _l.sys.puts(_outputPath); 
 Step(
      function f(){
        _l.fs.mkdir(_outputPath, 0777 ,this)
      },
      function makeItSo(err, folder){
         _l.fs.writeFile(_outputPath+'/'+framework.name+'.js', that.mergedFile,this);
                    
      }, function saved(err,f){
         if(err) throw err;
         _l.sys.puts("'"+framework.name+"' is saved to: "+_outputPath);
    
      }


 );


/*Write the merged file to output folder.*/

    

   // _l.fs.writeFile(fr.name+'.js', mergedFile,this);

    return framework;

};