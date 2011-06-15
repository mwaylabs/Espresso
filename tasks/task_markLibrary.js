// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      28.01.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var Task_MarkLibrary,
    Task = require('./task').Task;
/**
 * @class
 * Lookup for all given 3rd party frameworks, take the names and mark
 * the names of the files to include in offline manifest and for the entries in the
 * index.html
 *
 * @extends Task
 */
Task_MarkLibrary = exports.Task_MarkLibrary = function() {

  /* Properties */
  this.name = 'Mark as Library';

};

/**
 * @description
 * Get the run() function from Task.
 */
Task_MarkLibrary.prototype = new Task();

/**
 * @description
 * Lookup for all given 3rd party frameworks, take the names and mark
 * the names of the files to include in offline manifest and for the entries in the
 * index.html
 *
 */
Task_MarkLibrary.prototype.duty = function(framework,callback){
var that = this,
    _framework = framework.app.libraries,
    _library = {},
    _akku = [];

    // Getting the library entry from the config.json, for the current framework.
    _framework.forEach(function(fr){
         if(fr.name === framework.name){
             _library = fr;
         }
    });

    // If current framework is 3rd party library ?!
    if(framework.library){
        if(_library.refs.length === 1 &&_library.refs[0] === '*'){  // if wildcard: '*' is given, take all entries.
         framework.files.forEach(function(file){
            framework.app.librariesNamesForIndexHtml.push(file.getBaseName()+file.getFileExtension());
        });
       }else{ // loop the the refs array to determine the files to use.
          framework.files.forEach(function(file){
            var _indexOfFile = _library.refs.indexOf(file.getBaseName()+file.getFileExtension());
                _akku.push(file.getBaseName()+file.getFileExtension());
            if(_indexOfFile === -1){
               framework.app.excludedFromCaching.push(file.getBaseName()+file.getFileExtension());
            };

         });
         _library.refs.forEach(function(ref){
             var _indexOfFile = _akku.indexOf(ref);  // crosscheck, if all files specified in the config file are existing.
             if(_indexOfFile === -1){
                console.log('WARN:'+that.style.cyan(' Third party file: ')+that.style.magenta(ref)+ that.style.cyan(' was specified, but cant be found in: "')
                            +that.style.magenta('frameworks/'+framework.name)+that.style.cyan('" could be a typo!'));
             }
             framework.app.librariesNamesForIndexHtml.push(ref);     
         });
      }
            
    }
    callback(framework);
};