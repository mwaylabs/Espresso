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
  this.execPath = "";  
  this.taskChain = new Array(); 

  /* Properties used by App */

  this.frameworks = [];


  if(!build_options){
     this.loadJSONConfig();
  } else{
     this.addOptions(build_options);
  }
  _l.sys.puts(this.execPath);

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

App.prototype.loadTheApplication = function(options) {
  
    var that = this, _theApplication = [];
_l.sys.puts("Load App")
  _theApplication = ['app'].map(function(module) {
    var _frameworkOptions  = {};
        _frameworkOptions.path = that.execPath + '/' + module;
        _frameworkOptions.name = that.name+'_App';
        _frameworkOptions.frDelimiter = that.execPath+'/';
        _frameworkOptions.app = that;
         /* Definition of standard build chain for The-M-Project«s core files*/
        _frameworkOptions.taskChain = new TaskManager(["dependency","merge"]).getTaskChain();
       return new Framework(_frameworkOptions);
    });

 this.addFrameworks(_theApplication); 
};

/**
 * Called when adding The-M-Project to the current build.
 * Loads the files for the core system.
 * @param options
 */
App.prototype.loadTheMProject = function(options) {
var that = this, _theMProject, _fr;

 /*
  * Getting all The-M-Project related files
  * and generate Framework objects.
  */
    //'datastore','foundation','utility'
 _theMProject = ['core','ui'].map(function(module) {
    var _frameworkOptions  = {};
        _frameworkOptions.path = that.execPath+'/frameworks/Mproject/modules/' + module;
        _frameworkOptions.name = module;
        _frameworkOptions.app = that;
        _frameworkOptions.frDelimiter = 'modules/';
         /* Definition of standard build chain for The-M-Project«s core files*/ 
        _frameworkOptions.taskChain = new TaskManager(["dependency","merge"]).getTaskChain();
       return new Framework(_frameworkOptions);
    });

 this.addFrameworks(_theMProject);


  _fr = ['jquery','jquery_mobile','underscore','themes'].map(function(module) {
    var _frameworkOptions  = {};
        _frameworkOptions.path = that.execPath+'/frameworks/Mproject/modules/' + module;
        _frameworkOptions.name = module;
        _frameworkOptions.app = that;
        _frameworkOptions.frDelimiter = 'modules/';
     //     Definition of standard build chain for The-M-Project«s core files
        _frameworkOptions.taskChain = new TaskManager(["copy"]).getTaskChain();
       return new Framework(_frameworkOptions);
    });

  this.addFrameworks(_fr);

};

/**
 * Builds the index.html page. Used for loading the application.
 * @param htmlStylesheets
 * @param htmlScripts
 */
App.prototype.buildIndexHTML = function() {

var html = [];

    html.push(
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
        '<meta name="apple-mobile-web-app-capable" content="yes">'+
        '<meta name="apple-mobile-web-app-status-bar-style" content="default">'+
        '<meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">'+
        '<title>'+this.name+'</title>'+
        '<script src="jquery-1.4.4.min.js"></script>'+
        '<script src="jquery.mobile-1.0a2.min.js"></script>'+
        '<script src="underscore-min.js"></script>'+
        '<script src="core.js"></script>'+
        '<script src="ui.js"></script>'+
        '<link href="theme/jquery.mobile-1.0a2.min.css" rel="stylesheet" />'+
        '<script src="'+this.name+'_App.js"></script>'+
      '<head>'
    );



    html.push(
      '<body>'
    );

    html.push('<script language="JavaScript">'+this.name+'.app.main();'+'</script>' );

    html.push(
    	  '</body>',
      '</html>'
    );

    html = html.join('\n');


    var _frameworkOptions  = {};
        _frameworkOptions.path = this.execPath;
        _frameworkOptions.name = 'IndexHtml';
        _frameworkOptions.app = this;
        _frameworkOptions.virtual = true;
        _frameworkOptions.frDelimiter = '/';
     //     Definition of standard build chain for The-M-Project«s core files
        _frameworkOptions.taskChain = new TaskManager(["copy"]).getTaskChain();
    var fr = new Framework(_frameworkOptions);

        fr.files.push(
                  new File({
                            frDelimiter: fr.frDelimiter,
                            virtual: true,
                            name:'/index.html', //name[name.length-1], /*name */
                            path:'/index.html', /*path */
                            framework: fr, /* the framework, this file belongs to.*/
                            content: html
                           })

                  );
//_l.sys.puts(fr.files[0].getName());
 var ar = [];
     ar.push(fr);
  this.addFrameworks(ar);
  _l.sys.puts(this.frameworks);

 
};

App.prototype.makeOutputFolder = function(callback){


var self = this;
var _outputPath = this.execPath+'/'+this.outputFolder;
   self.outP = [];
   self.outP.push(_outputPath);
   self.outP.push('/'+this.buildVersion);
   self.outP.push('/theme');
   self.outP.push('/images');
_l.sys.puts('makeing output dir');


 var _OutputDirMaker = function(callback) {
    var that = this;


    that._resourceCounter = 4; /*make 4 folders*/

    that.callbackIfDone = function() {
      if (that._resourceCounter === 0){
          callback();
      }
    };

    that.makeOutputDir = function(path) {

      if(that._resourceCounter >=1){
      _l.fs.mkdir(path, 0777 ,function(err){
          // if(err){}
           that._resourceCounter--;
           that.makeOutputDir(path+ self.outP.shift());


      });
      }
      that.callbackIfDone();

    }

  };


new _OutputDirMaker(callback).makeOutputDir(self.outP.shift());


};

/**
 * The function tat builds the application.
 * @param callback that should be called after the build.
 */
App.prototype.build = function(callback){

  this.buildIndexHTML();

var self = this;


var _AppBuilder = function(app, callback) {
    var that = this;


    /* amount of used frameworks, for this application. */
    that._resourceCounter = app.frameworks.length +1;
     console.log(require('util').inspect(that._resourceCounter, true, 1));

    /* callback checker, called if all frameworks are build. */
    that.callbackIfDone = function() {
      if (callback && that._resourceCounter <= 0){
          callback();
      }
    };

    that.build = function() {

      app.frameworks.forEach(function(framework) {
        framework.build(function(fr) {
          /* count  = -1 if a framework has been build. */
          that._resourceCounter -= 1;
          _l.sys.puts("############################# ############ #############  "+fr.name+" sets FRAMEWORK COUNTER = "+that._resourceCounter);

           /* fr.files_with_Dependencies.forEach(function(file){
               _l.sys.puts(file.getName()+' '+file.dependencies);
            }); */
           //  console.log(require('util').inspect(fr.files_with_Dependencies, true, 1));
          /* check if callback can be called, the condition ist that all frameworks has been build. */
          that.callbackIfDone();
        });
      });
    };
  };

//return new _AppBuilder(this, callback).build();
    return this.makeOutputFolder(function(){
        new _AppBuilder(self, callback).build();
    });
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




