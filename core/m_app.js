// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      29.10.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * Definition of App class.
 *
 * Representation of the project.
 *
 */


var _l = {},
    App,
    Framework = require('./framwork').Framework;

/*
 * The required modules for App.
 *
 * sys    = node.js system module
 * fs     = filesystem
 * jslint = JavaScript source code validation.
 *
 */
_l.sys = require('sys');
_l.jslint = require('../lib/jslint').JSLINT;
_l.fs = require('fs');



/**
 * Constructor function.
 * Sets the build options for the app (project) to be build.
 *
 * @param build_options  the options to customize the build process
 */

App = exports.App = function (build_options) {

  /* Properties */

  /* Build configuration */
  this.name = 'defaultName';
  this.server = null;
  this.buildVersion = new Date().getTime();
  this.buildLanguage = 'english';
  this.theme = 'm-deafult';
  this.outputFolder = 'build';
  this.jslintCheck = true;
  this.pathName = "espresso_test_case/"

  /* Properties used by App */

  this.frameworks = [];


  if(!build_options){
     this.loadJSONConfig();
  } else{
     this.addOptions(build_options);
  }

};

/**
 * Sets the build options for the app (project) to be build.
 * 
 * @param build_options the options to customize the build process
 */
App.prototype.addOptions = function(build_options){

    var that = this;

    Object.keys(build_options).forEach(function (key) {
         that[key] = build_options[key];
    });
  
};

/**
 * Loads the appconfig file, passed in JSON syntax.
 * The appconfig.json should be in the root folder of the project to build.
 * 
 */
App.prototype.loadJSONConfig = function() {

    var config = JSON.parse(_l.fs.readFileSync(this.pathName+'/appconfig.json', 'utf8'));
    this.addOptions(config);

};


/**
 * Adding a Framework to the current build.
 */
App.prototype.addFrameworks = function(frameworks) {
var that = this;

  if (frameworks instanceof Array) {
    frameworks.forEach(function(framework) {
        that.frameworks.push(framework);
    });
  }


};

/**
 * Called when adding The-M-Project to the current build.
 * Loads the files for the core system.
 * @param options
 */
App.prototype.loadTheMProject = function(options) {
var that = this, _theMProject;


 /*
  * Getting all T-M-Project related files
  * and generate Framework objects
  */
 _theMProject = ['datastore', 'foundation', 'utility'].map(function(module) {
    var _frameworkOptions  = {};
        _frameworkOptions.path = that.pathName+'modules/core/' + module;
        _frameworkOptions.name = module;
       return new Framework(_frameworkOptions);
    });

 this.addFrameworks(_theMProject); 

};

/**
 * Builds the index.html page. Used for loading the application.
 * @param htmlStylesheets
 * @param htmlScripts
 */
App.prototype.buildIndexHTML = function(htmlStylesheets, htmlScripts) {
 
};



/**
 *
 * Checks a JavaScript file for correctness according to JSLINT.
 * alex: 3/11/2010 will soon be moved to its own file/handler.
 *
 */
App.prototype.checkJSLINT = function(file){


    var data = _l.fs.readFileSync(this.pathName+file, encoding='utf8');
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


/**
 * The function tat builds the application.
 * @param callback that should be called after the build.
 */
App.prototype.build = function(callback){

     this.BuildStep2();
     callback(this);

};


/*
  Test function
 */
App.prototype.BuildStep1 = function(){


    var files = _l.fs.readdirSync('./espresso_test_case');

    for (var i = 0;  i<files.length; i++){
         this.checkJSLINT(files[i]);

    }


};


/*
   Test function 
 */
App.prototype.BuildStep2 = function(){

    this.frameworks.forEach(function(framework) {
         framework.browseFiles();
    });

};


