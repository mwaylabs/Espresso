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
_l.jslint = require('../lib/jslint').JSLINT;



Task_JSLINT = exports.Task_JSLINT = function() {


  /* Properties */

  /* Local properties */
  this.framework;
  this.name = 'jslint';
  this.files = [];
  this.filesDependencies = new Array();

  /* Adding the properties for Task_Dependency */
//  this.addProperties(properties);

};

Task_JSLINT.prototype.run = function(framework,callback,nextTask){
var that = this;

    this.framework = framework;
    var files = framework.files;



    if(this.next === undefined){
        _l.sys.puts('Running Task: "jslint"');
         files.forEach(function (file){
            that.checkJSLINT(file.path);

         });
       
        if(!(nextTask === undefined)){
            nextTask(framework,callback);
        }else{
            callback(framework);
        }
    }else{
         this.next.run(framework, callback, this.computeDependencies);
    }





    // nextTask(framework,callback);

};


Task_JSLINT.prototype.checkJSLINT = function(path,file){

    var data = _l.fs.readFileSync(path, encoding='utf8');
        erg = _l.jslint(data);
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


};