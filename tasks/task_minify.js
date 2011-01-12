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
 * minifiy files. d
 */
Task_Minify.prototype.duty = function(framework,callback){
var that = this, _data = '',
    sp = require('child_process').spawn;

    if(framework.app.minify){

   // min = sp('java', ['-jar', that._l.path.join(__dirname, '..', 'bin', 'yuicompressor-2.4.2.jar'), '--type', 'js']);
      min = sp('java', ['-jar', that._l.path.join(__dirname, '..', 'bin', 'compiler.jar'),
                        '--compilation_level', 'SIMPLE_OPTIMIZATIONS',
                        '--warning_level','QUIET']);

      min.stdout.addListener('data', function(newData) {
       _data += newData;
      });

      min.stderr.addListener('data', function(data) {
        console.log(data);
        that._l.sys.print(data);
      });

      min.addListener('exit', function(code) {
        if (code !== 0) {
          console.log('ERROR: Minifier exited with code ' + code);
        } else {
            framework.files[0].content = _data;
            callback(framework);
        }
      });

      min.stdin.write(framework.files[0].content);
      min.stdin.end();
   }
};
