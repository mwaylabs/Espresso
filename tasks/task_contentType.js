// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      29.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================



var Task_ContentType,
    Task = require('./task').Task;

/**
 * @class
 *
 * @description
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
    ".json"    :  "application/json",
    ".ttf"     :  "application/x-font-ttf",
    ".otf"     :  "font/opentype",
    ".eot"     :  "application/vnd.ms-fontobject",
    ".m4a"     :  "audio/mp4a-latm",
    ".woff"    :  "application/x-font-woff"
  };
};


Task_ContentType.prototype = new Task();


/**
 *
 * @param framework
 * @param callback
 */
Task_ContentType.prototype.duty = function(framework,callback){
var self = this;
    
  framework.files.forEach(function(cF){
  cF.contentType = (self.contentTypes[cF.getFileExtension()]) ? self.contentTypes[cF.getFileExtension()] :  'text/plain';

   switch (true) {
     case (cF.isWebfont()):
       cF.requestPath = 'theme/'+cF.getBaseName()+cF.getFileExtension();
       break;
     case (cF.isImage()):
       cF.requestPath = 'theme/images/'+cF.getBaseName()+cF.getFileExtension();
       break;
     case (cF.isStylesheet()):
       cF.requestPath = 'theme/'+cF.getBaseName()+cF.getFileExtension();
       cF.contentType = "text/css; charset=utf-8";
       break;
     case (cF.isHTML()):
       cF.requestPath = cF.getBaseName()+cF.getFileExtension();
       break;
     default:
       cF.requestPath = cF.getBaseName()+cF.getFileExtension();
       break;
   }
});

  callback(framework);
};