// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      08.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var _l = {},
    Task_JSLINT,
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
_l.jslint = require('../lib/jslint').JSLINT;



Task_JSLINT = exports.Task_JSLINT = function() {


  /* Properties */
  this.name = 'jslint';


};

/**
 * Get the run() function from Task
 * @param framework
 */
Task_JSLINT.prototype = new Task;

/**
 * Checking the file sin the framework, according to jslint.
 * @param framework the reference to the framework this task is working with. 
 */
Task_JSLINT.prototype.duty = function(framework){
  var files = framework.files;

_l.sys.puts('Running Task JSLINT');
    files.forEach(function (file){
      if(file.isJavaScript()){
        erg = _l.jslint(file.content);
        if(!erg){

        for (i = 0; i < _l.jslint.errors.length; ++i) {
              e = _l.jslint.errors[i];

              if (e) {
                  _l.sys.puts('WARNING: jslint error in "'+ file +'" at line ' + e.line + ' character ' + e.character + ': ' + e.reason);
                  _l.sys.puts('         ' + (e.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
                  _l.sys.puts('');
              }
          }
        }

      }
     });

    return framework;

};