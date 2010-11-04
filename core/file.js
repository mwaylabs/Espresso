// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      03.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * Definition of every file used during the building step.
 */

var _l = {},
    File;

_l.fs = require('fs');
_l.path = require('path');
_l.sys = require('sys');


File = exports.File = function(properties) {
 
   /* Properties */
  this.path = '';
  this.framework = '';
  this.children = '';
  this.isHtml = false;
  this.content = '';
  this.url = '';
  this.extname;
  this.basename;
  this.name = '';  

  /* Adding the properties */
  this.addProperties(properties);

};

File.resourceExtensions = ['.png', '.jpg', '.gif', '.svg'];

/**
 * Add the properties for File.
 * @param properties
 */
File.prototype.addProperties = function(properties){

    var that = this;

    Object.keys(properties).forEach(function (key) {
         that[key] = properties[key];
    });

};

/**
 * Getting the name of the File without the file extension.
 */
File.prototype.getBaseName = function(){

  if (this.basename === undefined) {
    this.basename = _l.path.basename(this.path,_l.path.extname(this.path));
  }

  return this.basename;


};

/**
 * Getting the file extension.
 */
File.prototype.getFileExtension = function() {

  if (this.extname === undefined) {
    this.extname = _l.path.extname(this.path);
  }

  return this.extname;
};




