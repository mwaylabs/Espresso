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
    Step = require('../lib/step');
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
  this.combineScripts = false;
  this.combineStylesheets = true;
  this.minifyScripts = false;
  this.minifyStylesheets = false;
  this.defaultLanguage = 'english';
  this.buildLanguage = 'english';

  /* Local properties */
  this.path = '';
  this.name = '';
  this.url  = '';
  this.files = new Array();
  this.filesDependencies = new Array();
  this.taskChain = new Array();

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
 * Browse throw all files containing in the Framework.
 */
Framework.prototype.loadFiles = function(path,callback){

    
var _FileBrowser = function(framework, callback) {
    var that = this;

    that.count = 0;

    that.files = [];

    that.callbackIfDone = function() {
      if (that.count <= 0){
       //    _l.sys.puts("CB CALLLED with counter = "+that.count); 
          callback(that.files);
      }
    };

    that.browse = function(path) {
      _l.fs.stat(path, function(err, stats) {
         // that.count += 1;
        if (err){
            throw err;
        }else {

          if (stats.isDirectory()) {
             //that.count -= 1;
            _l.fs.readdir(path, function(err, subpaths) {
//that.count += subpaths.length;
 //_l.sys.puts('subapths3 = '+subpaths + " counted sub files = "+that.count);

              if (err){
                  throw err;
              }else {
                //that.count += subpaths.length - 1;
                subpaths.forEach(function(subpath) {
             if (subpath.match('\\.')) {
                     that.count += 1;
                    //  _l.sys.puts('subapth = '+subpath);
                    //   _l.sys.puts(that.count);

                  } that.browse(_l.path.join(path, subpath));
                });
               }
            });

          } else {

            _l.fs.readFile(path, encoding='utf8',function(err, data) {
              that.count -= 1;
              if (err){
                throw err;
              }else{
                framework.files.push(
                  new File({
                            name: path,
                            path: path,
                            framework: framework,
                            content: data
                           })
                            
                  );
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

    this.loadFiles(that.path, callback); 

  /*
    this.taskChain.forEach(function(task){
       task.run(that);
    });
  */  
   
 //  console.log(require('util').inspect(this.filesDependencies, true, null));

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

