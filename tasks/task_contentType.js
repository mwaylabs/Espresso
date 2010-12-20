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

/**
 * @class
 * Determine the content type for every file contained in a framework.
 * The content type is attached ot the files directly.
 *
 * @extends Task
 */
Task_ContentType = exports.Task_ContentType = function() {

  /* Properties */
  this.name = 'content type';
  this.contentTypes = {
    ".js"      :  "text/javascript; charset=utf-8",
    ".css"     :  "text/css; charset=utf-8",
    ".manifest":  "text/cache-manifest",
    ".html"    :  "text/html",
    ".png"     :  "image/png",
    ".jpg"     :  "image/jpeg",
    ".gif"     :  "image/gif",
    ".svg"     :  "image/svg+xml",
    ".json"    :  "application/json"
  };
};


Task_ContentType.prototype = new Task;


/**
 *
 * @param framework
 * @param callback
 */
Task_ContentType.prototype.duty = function(framework,callback){
var self = this;
  framework.files.forEach(function(_cF){
  _cF.contentType = (self.contentTypes[_cF.getFileExtension()]) ? self.contentTypes[_cF.getFileExtension()] :  'text/plain';

   switch (true) {
     case (_cF.isImage()):
       _cF.requestPath = '/'+'theme/images/'+_cF.getBaseName()+_cF.getFileExtension();
       break;
     case (_cF.isStylesheet()):
       _cF.requestPath = '/'+'theme/'+_cF.getBaseName()+_cF.getFileExtension();
       _cF.contentType = "text/css; charset=utf-8";
       break;
     case (_cF.isHTML()):
       _cF.requestPath = '/'+_cF.getBaseName()+_cF.getFileExtension();
       break;
     default:
       _cF.requestPath = '/'+_cF.getBaseName()+_cF.getFileExtension();
       break;
   }
});

  callback(framework);
};