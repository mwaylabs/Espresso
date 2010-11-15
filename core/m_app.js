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
    TaskManager = require('./task_manager').TaskManager,
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
  this.pathName = "";
  this.taskChain = new Array(); 

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

    var config = JSON.parse(_l.fs.readFileSync(this.pathName+'appconfig.json', 'utf8'));
    this.addOptions(config);

};

/**
 * Adding the task chain to the app.
 */
App.prototype.addTaskChain = function() {

  // this.taskChain = new TaskManager(["dependency"]).getTaskChain();

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
  * Getting all The-M-Project related files
  * and generate Framework objects.
  */
    //'datastore','foundation','utility'
 _theMProject = ['core'].map(function(module) {
    var _frameworkOptions  = {};
        _frameworkOptions.path = that.pathName+'/frameworks/Mproject/modules/' + module;
        _frameworkOptions.name = module;
        _frameworkOptions.buildVersion = that.buildVersion;
        _frameworkOptions.appName = that.name;
         /* Definition of standard build chain for The-M-Project«s core files*/ 
        _frameworkOptions.taskChain = new TaskManager(["dependency"]).getTaskChain();
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
 * The function tat builds the application.
 * @param callback that should be called after the build.
 */
App.prototype.build = function(callback){

var _AppBuilder = function(app, callback) {
    var that = this;


    /* amount of used frameworks, for this application. */
    that._resourceCounter = app.frameworks.length;

    /* callback checker, called if all frameworks are build. */
    that.callbackIfDone = function() {
      if (callback && that._resourceCounter <= 0) callback();
    };

    that.build = function() {

      app.frameworks.forEach(function(framework) {
        framework.build(function(fr) {
          /* count  = -1 if a framework has been build. */
          that._resourceCounter -= 1;
          _l.sys.puts("FR COUNTER = "+that._resourceCounter);
             console.log(require('util').inspect(fr.filesDependencies, true, 1));
          /* check if callback can be called, the condition ist that all frameworks has been build. */
          that.callbackIfDone();
        });
      });
    };
  };

return new _AppBuilder(this, callback).build();
};


/**
 * Saves the application to the filesystem. Inside the app folder, specified by the
 * outputFolder property.
 * @param callback that should be called after the build.
 */
App.prototype.saveLocal = function(callback){

     _l.sys.puts('save application to filesystem');

};


/*
 * Function for espresso development and has only testing duty!
 * This function will NOT be in the finished version of Espresso.
 */
App.prototype.BuildStep1 = function(){
var that  = this;
    this.frameworks.forEach(function(framework) {
         framework.loadFiles();
         var files = framework.files;
         _l.sys.puts('\n');
         _l.sys.puts('Files in '+framework.name);
         files.forEach(function (file){
            //that.checkJSLINT(file.path);
           _l.sys.puts('File: '+file.getBaseName()+ ' extension: '+ file.getFileExtension());
         });
    });

 _l.sys.puts('Used BuildStep 1');
};




