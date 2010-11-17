// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      04.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


/**
 * Definition of Framework class.
 *
 * Representation of the Framework used in the build chain.
 *
 */


var _l = {},
    Framework,
    File = require('./file').File;


/*
 * The required modules for Framework.
 *
 * sys    = node.js system module
 * fs     = filesystem
 *
 */
_l.fs = require('fs');
_l.sys = require('sys');
_l.path = require('path');



Framework = exports.Framework = function(properties) {


   /* Properties */

  /* Build configuration */
  this.buildVersion = null;
  this.combineScripts = true;
  this.combineStylesheets = true;
  this.minifyScripts = false;
  this.minifyStylesheets = false;
  this.defaultLanguage = 'english';
  this.buildLanguage = 'english';

  /* Local properties */
  this.appName = '';  
  this.path = '';
  this.execPath = ''; 
  this.name = '';
  this.url  = '';
  this.outputFolder= '';  
  this.files = [];
  this.files_without_Dependencies = [];
  this.files_with_Dependencies = [];
  this.dependencyTrees = [];
  this.taskChain = [];

  /* Adding the properties fot this Frameworks */
  this.addProperties(properties);

};


/**
 * Sets the Properties for Framework
 * @param properties
 */
Framework.prototype.addProperties = function(properties){

    var that = this;

    Object.keys(properties).forEach(function (key) {
         that[key] = properties[key];
    });


};

/**
 * Browse throw all resources containing in the Framework.
 */
Framework.prototype.loadFiles = function(path,callback){

    
var _FileBrowser = function(framework, callback) {
    var that = this;
    
     /* keep in track of the files, to load. Execute callback only if all resources are loaded*/
    that._resourceCounter = 0;

    that.callbackIfDone = function() {
      if (that._resourceCounter <= 0){
          callback(framework.files);
      }
    };

    that.browse = function(path) {
      _l.fs.stat(path, function(err, stats) {
        if (err){
            
            throw err;
            
        }else {

          if (stats.isDirectory()) {
            _l.fs.readdir(path, function(err, subpaths) {

              if (err){
                  throw err;
              }else {
                subpaths.forEach(function(subpath) {
                  /* add 1 to the counter if subfile is NOT a folder*/
                 if (subpath.match('\\.')) {that._resourceCounter += 1;}
                 that.browse(_l.path.join(path, subpath));
                });
               }
            });

          } else {

            _l.fs.readFile(path, encoding='utf8',function(err, data) {

               if (err){
                throw err;
              }else{
                 /* Add a new file to the framework*/
                framework.files.push(
                  new File({
                            name: path, /*name */
                            path: path, /*path */
                            framework: framework, /* the framework, this file belongs to.*/
                            content: data /*the raw data content of this file*/
                           })

                  );
                /* inform the  resource counter that we added a file*/
                that._resourceCounter -= 1;
                /* check if all files has been loaded, if yes, execute callback*/
                that.callbackIfDone();
              }
            });
          }
        }
      });
    };
  };
return new _FileBrowser(this, callback).browse(path);
};



/**
 * Building the framework, included all files.
 */
Framework.prototype.build = function(callback){
var that = this;
_l.sys.puts('\n****** Calling build for "'+this.name+'" ******');

  this.loadFiles(that.path, function(files) {
    var files = files;
        _l.sys.puts("Files for '"+that.name+"' loaded");
       that.taskChain.run(that,callback);
  });

};

/**
 * Override Object.toString()
 */
Framework.prototype.toString = function() {

    return 'Name: '+this.name + '\n'
          +'Path: '+this.path + '\n';
};


/*
 * Function for espresso development. Has only testing duty.
 * This function will NOT be in the finished version of Espresso. 
 */
Framework.prototype.testFunction = function(){
 _l.sys.puts('\n****** Calling build for "'+this.name+'" ******');
     this.loadFiles();
     var files = this.files;
         files.forEach(function (file){
           _l.sys.puts('File: '+file.getBaseName()+ ' extension: '+ file.getFileExtension());
         });
     _l.sys.puts('\n');
};

