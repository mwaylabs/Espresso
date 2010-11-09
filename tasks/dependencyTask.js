// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      05.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


/**
 * Definition of Task_Dependency.
 *
 */


var _l = {},
    Task_Dependency,
    File = require('../core/file').File;

/*
 * The required modules for Task_Dependency.
 *
 * sys    = node.js system module
 * fs     = filesystem
 *
 */
_l.fs = require('fs'); 
_l.sys = require('sys');



Task_Dependency = exports.Task_Dependency = function() {


  /* Properties */

  /* Local properties */
  this.framework;
  this.name = 'dependencie_task';
  this.files = [];
  this.filesDependencies = new Array();



  /* Adding the properties for Task_Dependency */
  // this.addProperties(properties);

};


Task_Dependency.prototype.run = function(framework){


    this.framework = framework;
    this.computeDependencies();

};


Task_Dependency.prototype.computeDependencies = function() {
var that = this;

   this.framework.files.forEach(function(file) {
         var _re, _match, _path;

         var _dependenciesObject = new Object();
             _dependenciesObject.dependencies = [];

          _re = new RegExp("m_require\\([\"'](.*?)[\"']\\)", "g");

          while (_match = _re.exec(file.content)) {
            _path = _match[1];
            if (!/\.js$/.test(_path)){
                _path += '.js';
            }
            _dependenciesObject.dependencies.push(_path);
          }

       that.framework.filesDependencies[file.getBaseName()] = _dependenciesObject;
    });

};

