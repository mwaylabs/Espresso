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
_l.qfs = require('../lib/qfs');



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
  this.app = null;
  this.virtual = false;  
  this.path = '';
  this.name = '';
  this.url  = '';
  this.frDelimiter;
  this.files = [];
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

Framework.prototype.isVirtual = function(){

  return this.virtual;

}


/**
 * Browse throw all resources containing in the Framework.
 */
Framework.prototype.loadFiles = function(path,callback){

    
var _FileBrowser = function(framework, callback) {
    var that = this;
    that._filesToExclude = ['.DS_Store']; /*Files that should be excluded*/
    
     /* keep in track of the files, to load. Execute callback only if all resources are loaded*/
    that._resourceCounter = 0;

    that.callbackIfDone = function() {
      if (that._resourceCounter <= 0){
          callback(framework.files);
      }
    };

    /**
     * Check if a file path contains a file that should not be in the final build.
     * @param path, the path to check.
     */
    that.checkIfFileShouldBeExcluded = function (path){

        var fileBaseName = path.split('/');

        if(that._filesToExclude.indexOf(fileBaseName[fileBaseName.length-1]) === -1){
            return false;
        }else{
            return true;
        }

    }

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
                   if(that.checkIfFileShouldBeExcluded(subpath)){
                   }else{
                      /* add 1 to the counter if sub file is NOT a folder*/
                      if (subpath.match('\\.')) {that._resourceCounter += 1;}
                      that.browse(_l.path.join(path, subpath)); 
                   }

                });
               }
            });

          } else {

            _l.fs.readFile(path, encoding='utf8',function(err, data) {

                if (err){
                throw err;
               }else{

                framework.files.push(
                  new File({
                             frDelimiter: framework.frDelimiter,
                             name: path,
                             path: path,
                             framework: framework,
                             content: data
                            })

                  );
                that._resourceCounter -= 1;
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
_l.sys.puts('\n****** calling build for "'+this.name+'" ******');

    if(that.isVirtual()){
       that.taskChain.run(that,callback);
    }else{
       this.loadFiles(that.path, function(files) {
            _l.sys.puts("Files for '"+that.name+"' loaded");
            that.taskChain.run(that,callback);
       });
    }
};

/**
 * Override Object.toString()
 */
Framework.prototype.toString = function() {

    return 'Name: '+this.name + '\n'
          +'Path: '+this.path + '\n';
};



