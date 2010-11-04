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

 //   file = new File({ path: this.name, handler: handler, content: this.rootContent(), isHtml: true, framework: this });

    return files;
};


Framework.prototype.loadFiles = function() {

 var that = this;

    var files = _l.fs.readdirSync(this.path);

     for (var i = 0;  i<files.length; i++){

         this.files.push(new File({ path: that.path, content: files[i]}));

     }


};


/**
 * Override Object.toString()
 */
Framework.prototype.toString = function() {

    return 'Name = '+this.name + '\n'
          +'Path = '+this.path + '\n';
};


