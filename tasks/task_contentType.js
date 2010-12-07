// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      29.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================



var Task_ContentType,
    Task = require('./Task').Task;


Task_ContentType = exports.Task_ContentType = function() {

  /* Properties */
  this.name = 'content type';
  this.contentTypes = {
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".manifest": "text/cache-manifest",
    ".html": "text/html",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".json": "application/json"
  };
     


};

/**
 * Get the run() function from Task
 * @param framework
 */
Task_ContentType.prototype = new Task;


Task_ContentType.prototype.duty = function(framework,callback){
var self = this;

  framework.files.forEach(function(currentFile){
          currentFile.contentType = (self.contentTypes[currentFile.getFileExtension()]) ? self.contentTypes[currentFile.getFileExtension()] :  'text/plain';

       if(currentFile.isStylesheet()){
          currentFile.requestPath = '/'+'theme/'+currentFile.getBaseName()+currentFile.getFileExtension();
          currentFile.contentType = "text/css; charset=utf-8";
       }else if(currentFile.isImage()){
          currentFile.requestPath = '/'+'theme/images/'+currentFile.getBaseName()+currentFile.getFileExtension();
       }else if (currentFile.isHTML()){
          currentFile.requestPath = '/'+framework.app.name;
       }else{
          currentFile.requestPath = '/'+currentFile.getBaseName()+currentFile.getFileExtension();
       }
  });


  callback(framework);


};