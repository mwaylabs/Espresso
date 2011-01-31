// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      28.01.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var Task_MarkLibrary,
    Task = require('./task').Task;
/**
 * @class
 *
 * This is a empty task, which does nothing at all.
 * Every framework must provide al least one Task, so this would be the task if a framework needs
 * no manipulation of it files.
 *
 * @extends Task
 */
Task_MarkLibrary = exports.Task_MarkLibrary = function() {

  /* Properties */
  this.name = 'Mark as Library';

};

/**
 * @description
 * Get the run() function from Task.
 */
Task_MarkLibrary.prototype = new Task;

/**
 * @description
 * Void task .... do nothing here.
 */
Task_MarkLibrary.prototype.duty = function(framework,callback){
var _framework = framework.app.libraries;
var _fr = {},
    _akku = [];

    _framework.forEach(function(fr){
         if(fr.name === framework.name){
             _fr = fr;
            // console.log('fr.name '+ fr.name + ' framework.name ' +framework.name);
         }
    });

    if(framework.library){
        if(_fr.refs[0] === '*'){
         framework.files.forEach(function(file){
          //  console.log(file.name);
            framework.app.librariesNamesForIndexHtml.push(file.getBaseName()+file.getFileExtension());
        });
       }else{
        var t = _fr.refs;
       //  console.log("t");
      //   console.log(t);

          framework.files.forEach(function(file){
              var _currentFileName;
             var found = false;
             t.forEach(function(fr){
                  _currentFileName= fr;
                 if(_currentFileName === file.getBaseName()+file.getFileExtension()){
                     found = true;
                 }
             });

             if(!found){
          //      console.log("Excluding : "+file.getBaseName()+file.getFileExtension());
               framework.app.excludedFromCaching.push(file.getBaseName()+file.getFileExtension())
             }else{
          //     console.log("Adding "+file.getBaseName()+file.getFileExtension());
               framework.app.librariesNamesForIndexHtml.push(file.getBaseName()+file.getFileExtension());
             }

         });

      }
            
    }
    callback(framework);

};