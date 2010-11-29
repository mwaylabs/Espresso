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
 * minifiy files, with google closure compiler
 */
Task_Minify.prototype.duty = function(framework,callback){

    callback(framework);

};


/*
sharedHandlers.add('minify', function() {
  var that = {};

  that.handle = function(file, request, callback) {
    that.next.handle(file, request, function(response) {
      var data = '',
          min, fileType;

      if (file.isStylesheet()) fileType = 'css';
      if (file.isScript()) fileType = 'js';
      min = l.spawn('java', ['-jar', l.path.join(__dirname, '..', 'bin', 'yuicompressor-2.4.2.jar'), '--type', fileType]);

      min.stdout.addListener('data', function(newData) {
        data += newData;
      });

      min.stderr.addListener('data', function(data) {
        l.sys.print(data);
      });

      min.addListener('exit', function(code) {
        if (code !== 0) {
          l.sys.puts('ERROR: Minifier exited with code ' + code);
        } else {
          response.data = data;
        }

        callback(response);
      });

      min.stdin.write(response.data);
      min.stdin.end();
    });
  };

  return that;
});
*/