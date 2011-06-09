// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      08.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var Task_JSLINT,
    Task = require('./task').Task;
    File = require('../core/file').File;

var jslint = require('../lib/jslint').JSLINT;



Task_JSLINT = exports.Task_JSLINT = function() {


  /* Properties */
  this.name = 'jslint';


};

/**
 * Get the run() function from Task
 * @param framework
 */
Task_JSLINT.prototype = new Task();

/**
 * Checking the file sin the framework, according to jslint.
 * @param framework the reference to the framework this task is working with. 
 */
Task_JSLINT.prototype.duty = function(framework,callback){
var files = framework.files;
var that = this;

this._e_.sys.puts('Running Task JSLINT');
    files.forEach(function (file){
      if(file.isJavaScript()){
        erg = that.jslint(file.content);
        if(!erg){

        for (i = 0; i < this._e_.jslint.errors.length; ++i) {
              e = that.jslint.errors[i];

              if (e) {
                  this._e_.sys.puts('WARNING: jslint error in "'+ file +'" at line ' + e.line + ' character ' + e.character + ': ' + e.reason);
                  this._e_.sys.puts('         ' + (e.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
                  this._e_.sys.puts('');
              }
          }
        }

      }
     });

    callback(framework);

};