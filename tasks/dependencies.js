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
 * Definition of Task_Dependencies.
 *
 */


var _l = {},
    Task_Dependencies,
    File = require('../core/file').File;

/*
 * The required modules for Task_Dependencies.
 *
 * sys    = node.js system module
 * fs     = filesystem
 *
 */
_l.fs = require('fs');
_l.sys = require('sys');



Task_Dependencies = exports.Task_Dependencies = function() {


  /* Properties */

  /* Local properties */
  this.framework;
  this.name = 'dependencie_task';
  this.files = [];
  this.filesDependencies = new Array();

  /* Adding the properties for Task_Dependencies */
//  this.addProperties(properties);

};


Task_Dependencies.prototype.run = function(framework){


    this.framework = framework;
    this.computeDependencies();

};


Task_Dependencies.prototype.computeDependencies = function() {
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

