// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      03.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var E = require('./e').E;
var normalize = require('path').normalize;

/**
 * @class
 * 
 * File is the representation of single resource in a Framework.
 * This could be a JavaScript file, a image or a CSS file.
 * Each file is a JavaScript object representation of such a resource.
 * File contains all needed information of the resource like:
 * name, path inside the framework folder or the content, the raw data.
 *
 * Files are organized in a Framework.
 * @param properties
 *
 * @extends M
 */
var File = exports.File = function (properties) {
 
   /* Properties */
  this.virtual               = false;
  this.containsMergedContent = false;
  this.isHtml                = false;
    
  this.path                  = '';
  this.framework             = '';
  this.children              = '';
  this.contentType           = '';
  this.requestPath           = '';
  this.name                  = '';

  this.content               = {}; // buffer object, to hold the content of a file.

  this.dependencies          = [];
  this.resourceExtensions    = ['.png', '.jpg', '.gif', '.svg'];

  this.extname;
  this.basename;
  this.frDelimiter;


  /* Adding the properties */
  if (properties) {
     this.addProperties(properties);
  }
};

/**
 * Getting all basic Espresso functions from the root prototype: M
 */
File.prototype = new E();

/**
 * @description
 * Add the properties for File.
 * @param properties {object}, the properties fo this file.
 */
File.prototype.addProperties = function(properties){
    var that = this;

    Object.keys(properties).forEach(function (key) {
         that[key] = properties[key];
    });
};

/**
 * @description
 * True if file is virtual.
 * A file is virtual, if it is generated during the build.
 * @return {boolean}, true if file is virtual.
 * @example
 * index.html
 */
File.prototype.isVirtual = function(){
      return this.virtual
};

/**
 * @description
 * Getting the name of the File.
 * @return {string}, the name of the file.
 */
File.prototype.getName = function(){
  var _filename = normalize(this.name).split(normalize(this.frDelimiter))[1];
  if (!_filename) {
    throw new Error('Unsplittable filename: ' + this.name + '. Delimiter: ' + this.frDelimiter);
  }
  return _filename;
};

/**
 * @description
 * Returns the name of the file without the file extension.
 * @return {string}, the base name of this file.
 */
File.prototype.getBaseName = function(){
  if (this.basename === undefined) {
   return this._e_.path.basename(this.path,this._e_.path.extname(this.path));
  }
  return this.basename;
};

/**
 * @description
 * Getting the file extension of this File.
 * @return {string}, the file extension.
 * @example
 *  .png,
 *  .jpg,
 *  .gif,
 *  .svg
 */
File.prototype.getFileExtension = function() {
  if (this.extname === undefined) {
   return this._e_.path.extname(this.path);
  }
  return this.extname;
};

/**
 * @description
 * Test if a File is a CSS stylesheet.
 * @return {boolean}, true if file is a stylesheet.
 */
File.prototype.isStylesheet = function() {
  return this.getFileExtension() === '.css';
};

/**
 * @description
 * Test if a File is a web-font.
 * @return {boolean}, true if file is a web-font.
 */
File.prototype.isWebfont = function() {
  return this.getFileExtension() === '.eot' || this.getFileExtension() === '.svg' || this.getFileExtension() === '.ttf' || this.getFileExtension() === '.woff';
};

/**
 * @description
 * Test if a File is a SASS stylesheet. Ending by .sass
 * @return {boolean}, true if file is a stylesheet.
 */
File.prototype.isSASS_Stylesheet = function() {
  return this.getFileExtension() === '.sass';
};

/**
 * @description
 * Test if a File is a HTML file.
 * @return {boolean}, true if file is a stylesheet.
 */
File.prototype.isHTML = function() {
  return this.getFileExtension() === '.html';
};

/**
 * @description
 * Test if a File is a JavaScript file.
 * @return {boolean}, true if file is JavaScript.
 */
File.prototype.isJavaScript = function() {
  return this.getFileExtension() === '.js'; 
};


/**
 * @description
 * Test if a File is a cache.manifest file. Ending by .manifest
 * @return {boolean}, true if file is JavaScript.
 */
File.prototype.isManifest = function() {
  return this.getFileExtension() === '.manifest'; 
};

/**
 * @description
 * Test if a File is a image. 
 * Based on the possible resource extensions.
 *
 * @return {boolean}, true if file is a Image.
 * @example
 *  .png,
 *  .jpg,
 *  .gif,
 *  .svg
 */
File.prototype.isImage = function() {
var that = this;
    var x  = false;
    this.resourceExtensions.forEach(function (resExt) {
        if(resExt === that.getFileExtension()){
            x = true;
        }
    });
  return x;
};


/**
 * @description
 * Compare the basename of this File object with a other file.
 * @param otherFile {object}, the file object to compare with this.
 * @return {boolean} true if this has the same base name as otherFile, false otherwise.
 */
File.prototype.equalBaseName = function (otherFile){
  if(otherFile instanceof File){
    return (this.getBaseName() === otherFile.getBaseName());    
  }
    return false;
};

/**
 * @description
 * Override Object.toString()
 * @exampleText
 * Basename: main.js
 * Filepath: /foo/bar/main.js
 * @return {string} a readable presentations of this file object.
 */
File.prototype.toString = function() {
    return 'Basename: ' + this.name + '\n'
          + 'Filepath: ' + this.path + '\n';
};
