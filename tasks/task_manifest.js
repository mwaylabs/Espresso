// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      06.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var Task_Manifest,
    Task = require('./task').Task;

/**
 * @class
 * This Task checks files in a framework, if some files are exclude
 * from caching the files on the device.
 *
 * @extends Task
 */
Task_Manifest = exports.Task_Manifest = function() {
  /* Properties */
  this.name = 'manifest';
};

/**
 * @description
 * Get the run() function from Task.
 * @property
 */
Task_Manifest.prototype = new Task();

/**
 * @description
 * The concrete duty this task has to achieve.
 * @param framework
 * @param callback
 */
Task_Manifest.prototype.duty = function(framework,callback){
var that = this,
    _manifestExclude = (framework.app.excludedFromCaching) ? framework.app.excludedFromCaching : false,
    _app = framework.app;

     if(_manifestExclude){
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