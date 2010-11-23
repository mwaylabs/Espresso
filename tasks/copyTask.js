// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      19.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================



var _l = {},
    Task_Copy,
    Task = require('./Task').Task;

/*
 * The required modules.
 */
_l.sys = require('sys');
_l.fs = require('fs');
_l.spawn = require('child_process').spawn;
_l.path = require('path');



Task_Copy = exports.Task_Copy = function() {

  /* Properties */
  this.name = 'copy';
  this.buffer;

};

/**
 * Get the run() function from Task
 * @param framework
 */
Task_Copy.prototype = new Task;

/**
 * Combining all the files, contained in the result of merging process
 * @param framework the reference to the framework this task is working with.
 */
Task_Copy.prototype.duty = function(framework,callback){
var that = this;
var _outputPath = framework.app.execPath+'/'+framework.app.outputFolder;


 var _FileCopier = function(framework, callback) {
    var that = this;

    that._resourceCounter = framework.files.length -1;
    that.callbackIfDone = function() {
      if (that._resourceCounter === 0){
       //   _l.sys.puts("callbackIfDone for ++++++++         ++++++++++++ "+framework.name);
          callback(framework);
      }
    };

    that.copy = function(files) {

     var current_File = files.shift();

     if(current_File !== undefined ){
       //  _l.sys.puts("current_File Extension ++++++++   for "+framework.name+"      ++++++++++++ "+current_File.getBaseName());
             if (current_File.isJavaScript()){
             _l.sys.pump(_l.fs.createReadStream(current_File.path),
                         _l.fs.createWriteStream(_outputPath+'/'+framework.app.buildVersion+'/'+current_File.getBaseName()+current_File.getFileExtension()),
                            function(err){
                                if(err) {throw err}
                                that._resourceCounter--;
                                that.copy(files);
                            });
             }else if (current_File.isImage()){
             _l.sys.pump(_l.fs.createReadStream(current_File.path),
                         _l.fs.createWriteStream(_outputPath+'/'+framework.app.buildVersion+'/theme/images/'+current_File.getBaseName()+current_File.getFileExtension()),
                            function(err){
                                if(err) {throw err}
                                that._resourceCounter--;
                                that.copy(files);
                            });

             }else if (current_File.isStylesheet()){
             _l.sys.pump(_l.fs.createReadStream(current_File.path),
                         _l.fs.createWriteStream(_outputPath+'/'+framework.app.buildVersion+'/theme/'+current_File.getBaseName()+current_File.getFileExtension()),
                            function(err){
                                if(err) {throw err}
                                that._resourceCounter--;
                                that.copy(files);
                            });

             }else if (current_File.isVirtual()){
                 _l.fs.writeFile(_outputPath+'/'+framework.app.buildVersion+'/'+current_File.getBaseName()+current_File.getFileExtension(), current_File.content,
                         function(err){
                           if(err) {throw err}
                           that._resourceCounter--;
                           that.copy(files);
                         });

             }

     }
    that.callbackIfDone();

    }


 };

 new _FileCopier(framework, callback).copy(framework.files);


};

