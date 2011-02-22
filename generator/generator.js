// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      14.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var E = require('../core/e').E,
    Generator;



/**
 * @class
 * The prototype for any type of concrete Generator.
 *
 * @constructor
 */
Generator = exports.Generator = function() {
  /* Properties */ 
   this.projectName = '';   // the name of the application.
   this.outputPath=''; 
};

/*
 * Getting all basic Espresso functions from the root prototype: M 
 */
Generator.prototype = new E();

/**
 * @property
 * The reference to File prototype.
 * 
 * @link <File>
 */
Generator.prototype.File = require('../core/file').File;

/**
 * @property
 * The reference to the 'Mu' (Mustache) template engine.
 */
Generator.prototype.Mu =  require('../lib/mu');

/**
 * Extracts the name of the application from the
 * path of the applications directory.
 * @param current_Dir
 * The current directory, of the application.
 */
Generator.prototype.setProjectName  = function(current_Dir){
    var x = current_Dir.split('/');
    this.projectName = x[x.length-1];
};

/**
 * @description
 * Print a help or usage note on the shell
 */
Generator.prototype.printHelp = function(){
   console.log("printHelp(), Generator");
};

/**
 * @description
 * This function is overridden by any Generator.  
 * @param args, the command line arguments to check
 */
Generator.prototype.dispatchArguments = function(args){
    console.log("dispatchArguments(), Generator");
};

/**
 * @description
 * This function is overridden by any Generator.
 * @param args
 * @param current_Dir
 */
Generator.prototype.gen = function(args,current_Dir){
    console.log("gen(), Generator");
};