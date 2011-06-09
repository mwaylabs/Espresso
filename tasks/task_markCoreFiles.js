// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      08.02.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var Task_MarkCoreFiles,
    Task = require('./task').Task;
/**
 * @class
 * Lookup for all given 3rd party frameworks, take the names and mark
 * the names of the files to include in offline manifest and for the entries in the
 * index.html
 *
 * @extends Task
 */
Task_MarkCoreFiles= exports.Task_MarkCoreFiles = function() {

  /* Properties */
  this.name = 'Mark as Library';

};

/**
 * @description
 * Get the run() function from Task.
 */
Task_MarkCoreFiles.prototype = new Task();

/**
 * @description
 * Lookup for all given 3rd party frameworks, take the names and mark
 * the names of the files to include in offline manifest and for the entries in the
 * index.html
 *
 */
Task_MarkCoreFiles.prototype.duty = function(framework,callback){
var that = this;

    if(!framework.app.coreNamesOBj){
        framework.app.coreNamesOBj = {};
    }

    

    framework.files.forEach(function(file){
           switch (true) {
                case (file.isJavaScript()):
                  framework.app.coreNamesOBj[framework.name]
                          = '<script type="text/javascript" src="'+file.getBaseName()+file.getFileExtension()+'"></script>';
                  break;
                case (file.isStylesheet()):
                  var frName = (framework.is_a_plugin) ? framework.name+'-theme' :  framework.name;      
                  framework.app.coreNamesOBj[frName]
                          = '<link type="text/css" href="theme/'+file.getBaseName()+file.getFileExtension()+'" rel="stylesheet" />';
                  break;
                default:
                  break;
            }

    });



callback(framework);
};