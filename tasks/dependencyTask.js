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
    Task = require('./Task').Task;
    File = require('../core/file').File;

/*
 * The required modules for Task_Dependency.
 *
 * sys    = node.js system module
 * fs     = filesystem
 *
 */
_l.sys = require('sys');



Task_Dependency = exports.Task_Dependency = function() {


  /* Properties */
  this.name = 'dependencie_task';

};

/**
 * Get the run() function from Task
 * @param framework
 */
Task_Dependency.prototype = new Task;


/**
 * The duty of this task.
 * @param framework the reference to the framework this task is working with. 
 */
Task_Dependency.prototype.duty = function(framework) {
var that = this;
_l.sys.puts('Running Task: "dependency"');

   framework.files.forEach(function(file) {
      if(file.isJavaScript()){
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

       framework.filesDependencies[file.getBaseName()] = _dependenciesObject;
           }
    });
    
    return framework; //  callback(framework);
};

