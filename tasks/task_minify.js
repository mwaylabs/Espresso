// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      18.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var Task_Minify,
    Task = require('./Task').Task;


Task_Minify = exports.Task_Minify = function() {
  /* Properties */
  this.name = 'minifiy';
};

/**
 * Get the run() function from Task
 * @param framework
 */
Task_Minify.prototype = new Task;

/**
 * minifiy files. 
 */
Task_Minify.prototype.duty = function(framework,callback){
var that = this, _data = '',
    _cp = require('child_process').spawn;

    if(framework.app.minify){
      minify = _cp('java', ['-jar', that._e_.path.join(__dirname, '..', 'bin', 'compiler.jar'),
                        '--compilation_level', 'SIMPLE_OPTIMIZATIONS',
                        '--warning_level','QUIET']);

      minify.stdout.addListener('data', function(newData) {
       _data += newData;
      });

      minify.stderr.addListener('data', function(data) {
        console.log(data);
      });

      minify.addListener('exit', function(code) {
        if (code !== 0) {
          console.log('ERROR: Minifier exited with code ' + code);
        } else {
            framework.files[0].content = _data;
            callback(framework);
        }
      });

      minify.stdin.write(framework.files[0].content);
      minify.stdin.end();
   }else{
        callback(framework); 
    }
};
