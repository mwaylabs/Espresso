// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      06.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================



var Task_Manifest,
    Task = require('./Task').Task;


Task_Manifest = exports.Task_Manifest = function() {

  /* Properties */
  this.name = 'manifest';

};

/**
 * Get the run() function from Task.
 */
Task_Manifest.prototype = new Task;

/**
 * 
 */
Task_Manifest.prototype.duty = function(framework,callback){
var that = this,
    _manifestExclude = (framework.app.excludeFromCaching) ? framework.app.excludeFromCaching.excludedFiles : false;
    _app = framework.app;

     if(_manifestExclude && _manifestExclude.length !== 0){
         framework.files.forEach(function(file){
             if(_manifestExclude.indexOf(file.getBaseName()+file.getFileExtension()) === -1){
               _app.manifest.cache.push(file.requestPath);
             }else{
               _app.manifest.network.push(file.requestPath);
             }           
         });
     }else{
       framework.files.forEach(function(file){
           _app.manifest.cache.push(file.requestPath);

         });
     }


    callback(framework);

};