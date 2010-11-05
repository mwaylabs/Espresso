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
  this.files = [];
  this.filesDependencies = new Array();

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
Framework.prototype.browseFiles = function() {
    var files = _l.fs.readdirSync(this.path);
    return files;
};

/**
 * load the files contained in the framework, and store them in
 * the framework property: that.files
 */
Framework.prototype.loadFiles = function() {

 var that = this;

 var files = this.browseFiles();

     files.forEach(function (file){
         var data = _l.fs.readFileSync(that.path+'/'+file, encoding='utf8');
         that.files.push(new File({ name: file, path: that.path+'/'+file, content: data}));
     });

};

/**
 * Building the framework, included all files.
 */
Framework.prototype.build = function(){

     this.loadFiles();
     this.computeDependencies();

   var util = require('util');
   console.log(util.inspect(this.filesDependencies, true, null));

};

/**
 *
 * computes the dependencies between files of the framework,
 * specified in the m_require function.
 * alex: 5/11/2010 will soon be moved to its own file/handler.
 *
 */
Framework.prototype.computeDependencies = function() {
var that = this;

   this.files.forEach(function(file) {
         var re, match, path;

         var _dependenciesObject = new Object();
             _dependenciesObject.dependencies = [];

          re = new RegExp("m_require\\([\"'](.*?)[\"']\\)", "g");

          while (match = re.exec(file.content)) {
            path = match[1];
            if (!/\.js$/.test(path)){
                path += '.js';
            }
            _dependenciesObject.dependencies.push(path);
          }

        that.filesDependencies[file.getBaseName()] = _dependenciesObject;
    });

};

/**
 * Override Object.toString()
 */
Framework.prototype.toString = function() {

    return 'Name = '+this.name + '\n'
          +'Path = '+this.path + '\n';
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

