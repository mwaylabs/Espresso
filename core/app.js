// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      29.10.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var _l = {},
    App,
    TaskManager = require('./task_manager').TaskManager,
    Framework = require('./framework').Framework;

/*
 * The required modules for App.
 *
 * sys    = node.js system module
 * fs     = filesystem
 */
_l.sys = require('sys');
_l.fs = require('fs');
var style = require('../lib/color');


/**
 * @class
 *
 * Definition of App class. App is Espresso«s core component.
 * App holds all information about the "The-M-Project" application that is build via Espresso.
 * Containing properties of the application and to control the build itself.
 * App takes care of the build process by hooking in the needed resources (Frameworks and Files)
 * and calling build on each resource(s).
 * For doing all this cool stuff, App needs some data/information to work with.
 * Those thinks are implemented in extra components.
 * App can contain multiple references to Framework (e.g. The-M-Project core files or the application itself).
 * By loading new Frameworks, App is adding a defined task chain to each Framework.
 * The task chain is prepared by the TaskManager.
 *
 * @param build_options, the options to customize the build process
 */

App = exports.App = function (applicationDirectory,server) {

  /* Properties */

  /* Build configuration */
  this.name = 'defaultName';
  this.clear = '';     
  this.server = server;
  this.buildVersion = Date.now(); //new Date.getTime(); // timestamp of the build.
  this.buildLanguages = [];
  this.theme = 'm-deafult';
  this.outputFolder = 'build'; // name of the output folder, default is 'build'.
  this.jslintCheck = true;
  this.execPath = "";  //  the a actually folder name, in which the application is located.
  this.taskChain = new Array();
  this.proxies = [];  
  this.excludedFromCaching;
  this.excludedFolders = [];
  this.excludedFiles = [];
    
  /* Properties used by App */
  this.frameworks = [];
  this.manifest = {
    "cache"   :[],
    "network" :[],
    "fallback":[]
  };

  if(applicationDirectory){
      this.execPath = applicationDirectory;
      this.loadJSONConfig();
  }
  console.log("\n");
};


App.prototype.supportedLanguages  = ['de_de','en_us'];


/**
 * @description
 * Sets the build options for the app (project) to be build.
 * @param build_options the options to customize the build process
 */
App.prototype.addOptions = function(build_options){
    var that = this;

    Object.keys(build_options).forEach(function (key) {
         that[key] = build_options[key];
    });
  
};

/**
 * @description
 * Loads the config file, passed in JSON syntax.
 * The 'config.json', should be in the root folder of the project to build.
 */
App.prototype.loadJSONConfig = function() {
    try{
        var config = JSON.parse(_l.fs.readFileSync(this.execPath+'/config.json', 'utf8'));
        this.addOptions(config);
        if(config.proxies){
           this.server.proxies = config.proxies; //adding proxies, if present.
        }
    }catch(ex){
       console.log(style.red('ERROR:')+style.cyan(' - while reading "config.json", error message: '+ex.message));
       process.exit(1); /* exit the process, reason: error in config.json*/
    }
};

/**
 * @description
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
 * @description
 * Load the projects related files.
 * The project is equals the application.
 */
App.prototype.loadTheApplication = function() {
var that = this, _theApplication = [],_theApplicationResources;

  _theApplication = ['app'].map(function(module) {
    var _frameworkOptions  = {};
        _frameworkOptions.path = that.execPath + '/' + module;
        _frameworkOptions.name = that.name+'_App';
        _frameworkOptions.frDelimiter = that.execPath+'/';
        _frameworkOptions.excludedFolders = ['resources'].concat(that.excludedFolders);
        _frameworkOptions.excludedFiles = ['.DS_Store'].concat(that.excludedFiles);
        _frameworkOptions.app = that;
         /* Definition of standard build chain for The-M-Project«s core files*/
        _frameworkOptions.taskChain = new TaskManager(["preSort","dependency","merge","contentType","manifest"]).getTaskChain();
       return new Framework(_frameworkOptions);
    });

 this.addFrameworks(_theApplication);

 _theApplicationResources = ['app/resources'].map(function(module) {
    var _frameworkOptions  = {};
        _frameworkOptions.path = that.execPath + '/' + module;
        _frameworkOptions.name = that.name+'_AppResources';
        _frameworkOptions.frDelimiter = that.execPath+'/';
        _frameworkOptions.excludedFolders = that.excludedFolders;
        _frameworkOptions.excludedFiles = ['.DS_Store'].concat(that.excludedFiles);
        _frameworkOptions.app = that;
         /* Definition of standard build chain for The-M-Project«s core files*/
        _frameworkOptions.taskChain = new TaskManager(["contentType","manifest"]).getTaskChain();
       return new Framework(_frameworkOptions);
    });

 this.addFrameworks(_theApplicationResources);
};

/**
 * @description
 * Called when adding The-M-Project to the current build.
 * Loads the files for the core system.
 * @param options
 */
App.prototype.loadTheMProject = function(options) {
var that = this, _theMProject, _theMProjectResources;

 /*
  * Getting all The-M-Project core files
  * and generate Framework objects.
  */
 _theMProject = ['core','ui'].map(function(module) {
    var _frameworkOptions  = {};
        _frameworkOptions.path = that.execPath+'/frameworks/Mproject/modules/' + module;
        _frameworkOptions.name = module;
        _frameworkOptions.app = that;
        _frameworkOptions.frDelimiter = 'modules/';
        _frameworkOptions.excludedFolders = that.excludedFolders;
        _frameworkOptions.excludedFiles = ['.DS_Store'].concat(that.excludedFiles);
         /* Definition of standard build chain for The-M-Project«s core files*/ 
        _frameworkOptions.taskChain = new TaskManager(["dependency","merge","contentType","manifest"]).getTaskChain();
       return new Framework(_frameworkOptions);
    });

 this.addFrameworks(_theMProject);

  /*
   * Getting the The-M-Project resources and third party frameworks,
   * like: jquery.js or underscore.js
   */
  _theMProjectResources = ['jquery','jquery_mobile','underscore','themes'].map(function(module) {
    var _frameworkOptions  = {};
        _frameworkOptions.path = that.execPath+'/frameworks/Mproject/modules/' + module;
        _frameworkOptions.name = module;
        _frameworkOptions.app = that;
        _frameworkOptions.frDelimiter = 'modules/';
        _frameworkOptions.excludedFolders = that.excludedFolders;
        _frameworkOptions.excludedFiles = ['.DS_Store'].concat(that.excludedFiles);
        _frameworkOptions.taskChain = new TaskManager(["contentType","manifest"]).getTaskChain();
       return new Framework(_frameworkOptions);
    });

  this.addFrameworks(_theMProjectResources);

};

/**
 * @description
 * Builds the index.html page. Used for loading the application.
 */
App.prototype.buildIndexHTML = function() {

var _indexHtml = [];

    _indexHtml.push(
      '<!DOCTYPE html>',
      '<html manifest="cache.manifest">',
      '<head>',
        '<meta name="apple-mobile-web-app-capable" content="yes">'+
        '<meta name="apple-mobile-web-app-status-bar-style" content="default">'+
        '<link rel="apple-touch-icon" href="/theme/images/apple-touch-icon.png"/>'+       
        '<meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">'+
        '<title>'+this.name+'</title>'+
        '<link href="theme/jquery.mobile-1.0a2.min.css" rel="stylesheet" />'+
        '<link href="theme/style.css" rel="stylesheet" />'+
        '<script src="jquery-1.4.4.min.js"></script>'+
        '<script src="jquery.mobile-1.0a2.min.js"></script>'+
        '<script src="underscore-min.js"></script>'+
        '<script src="core.js"></script>'+
        '<script src="ui.js"></script>'
    );

    if(this.supportedLanguages.length >= 1){
        this.supportedLanguages.forEach(function(lang){
           _indexHtml.push(
                   '<script src="'+lang+'.js"></script>'
           );
        });
    }

    _indexHtml.push(
        '<script language="JavaScript">var '+this.name+' = '+this.name+ '|| {}; M.Application.name="'+this.name+'";</script>'+
        '<script src="'+this.name+'_App.js"></script>'+
      '</head>'
    );

    _indexHtml.push(
      '<body>'
    );

    _indexHtml.push('<script language="JavaScript">'+this.name+'.app.main();'+'</script>' );

    _indexHtml.push(
    	  '</body>',
      '</html>'
    );

    _indexHtml = _indexHtml.join('\n');

    var _frameworkOptions  = {};
        _frameworkOptions.path = this.execPath;
        _frameworkOptions.name = 'IndexHtml';
        _frameworkOptions.app = this;
        _frameworkOptions.virtual = true;
        _frameworkOptions.frDelimiter = '/';
     //     Definition of standard build chain for The-M-Project«s core files
        _frameworkOptions.taskChain = new TaskManager(["contentType","manifest"]).getTaskChain();
    var fr = new Framework(_frameworkOptions);

        fr.files.push(
                  new File({
                            frDelimiter: fr.frDelimiter,
                            virtual: true,
                            name:'/index.html',
                            path:'/index.html',
                            framework: fr, /* the framework, this file belongs to.*/
                            content: _indexHtml
                           })

                  );
  var ar = [];
      ar.push(fr);
  this.addFrameworks(ar); 
};

/**
 * @description
 * Build a HTML5 valid cache.manifest file.
 * @param callback
 */
App.prototype.buildManifest = function(callback){
var self = this, _cacheManifest = [];

 /* adding entries for the Explicit CACHE section*/
 _cacheManifest.push(
   'CACHE MANIFEST',
   '#Application:'+this.name+', Version:'+this.version+', Timestamp:'+this.buildVersion,   //adding 'header' information.
   '\n',
   '# Explicitly cached entries',
   'CACHE:'
 );
 this.manifest.cache.forEach(function(expliFile){
   _cacheManifest.push(expliFile);
 });
  

 /* adding entries for the NETWORK section*/
 _cacheManifest.push(
   '\n',
   '# Resources that require the device/user to be online.',
   'NETWORK:'
 );
 this.manifest.network.forEach(function(networkFile){ // Files, exclude from explicitly section by user.
   _cacheManifest.push(networkFile);
 });
 this.server.proxies.forEach(function(proxy){   // Proxy entries.
   _cacheManifest.push(proxy.proxyAlias);
 });
 _cacheManifest.push('*'); // enable wildcard.

 /* adding entries for the FALLBACK section*/
 _cacheManifest.push(
   '\n',
   '# Fallback resources ',
   'FALLBACK:'
 );
 this.manifest.fallback.forEach(function(fallbackFile){
   _cacheManifest.push(fallbackFile);
 });


 var _frameworkOptions  = {};
     _frameworkOptions.path = this.execPath;
     _frameworkOptions.name = 'chacheManifest';
     _frameworkOptions.app = this;
     _frameworkOptions.virtual = true;
     _frameworkOptions.frDelimiter = '/';
     _frameworkOptions.taskChain = new TaskManager(["void"]).getTaskChain();
 var fr = new Framework(_frameworkOptions);
     fr.files.push(
              new File({
                       frDelimiter: fr.frDelimiter,
                       virtual: true,
                       name:'/cache.manifest',
                       path:'/cache.manifest',
                       contentType : 'text/cache-manifest',
                       requestPath :'/cache.manifest',
                       framework: fr, /* the framework, this file belongs to.*/
                       content: _cacheManifest.join('\n')
                       })
     );
  var ar = [];
      ar.push(fr);
  this.addFrameworks(ar); 
  callback();
};

/**
 * @description
 * Function to generate the projects output folders. 
 * @param {function}, the function that should be called after the output folders are made.
 */
App.prototype.makeOutputFolder = function(callback){
var self = this;
var _outputPath = this.execPath+'/'+this.outputFolder;
    self._outP = [];
    self._outP.push(_outputPath);
    self._outP.push('/'+this.buildVersion);
    self._outP.push('/theme');
    self._outP.push('/images');


 var _OutputDirMaker = function(callback) {
    var that = this;

    that._folderCounter = 4; /*make 4 folders*/

    that.callbackIfDone = function() {
      if (that._folderCounter === 0){
          callback()
      }
    };

    that.makeOutputDir = function(path) {
      if(that._folderCounter >=1){
        _l.fs.mkdir(path, 0777 ,function(err){
              // if(err){}
          that._folderCounter--;
          that.makeOutputDir(path+ self._outP.shift());
        });
      }
      that.callbackIfDone();
    }
  };
 new _OutputDirMaker(callback).makeOutputDir(self._outP.shift());
};

/**
 * @description
 * The function tat builds the application.
 * @param callback that should be called after the build.
 */
App.prototype.build = function(callback){
var self = this;
    
this.buildIndexHTML();

/* TODO: Sort frameworks before calling build.
   The application should be build first, to check for used resources and APIs,
   to exclude them later from the core framework
*/

var _AppBuilder = function(app, callback) {
    var that = this;
    /* amount of used frameworks, for this application. */
    that._frameworkCounter = app.frameworks.length ;
  
    /* callback checker, called if all frameworks are build. */
    that.callbackIfDone = function() {
      if (callback && that._frameworkCounter <= 0){
          callback();
      }
    };

    that.build = function() {
      console.log(style.green("Building components:"));  
      app.frameworks.forEach(function(framework) {
        framework.build(function(fr) {
          /* count  = -1 if a framework has been build. */
          that._frameworkCounter -= 1;
          console.log(style.magenta(fr.name)+style.green(': ')+style.cyan('done'));   
         // console.log('build() done for: "'+fr.name+'"');  
           //console.log(require('util').inspect(fr.files_with_Dependencies, true, 1));
          /* check if callback can be called, the condition ist that all frameworks has been build. */
          that.callbackIfDone();
        });
      });
    };
  };

 console.log(style.green('Building application: "')+style.magenta(this.name)+style.green('"')); 

  /*
   *  build batch:
   *  1) Build the Application
   *  11) Build each framework
   *  2) Build the cache manifest, after all frameworks has been build.
   *     This is done by calling 'buildManifest()' as callback after
   *     '_AppBuilder.build()' is done.
   *  3) Call callback, which leads to the next step of the build OR server process.
   *
   */
  new _AppBuilder(self, function(){self.buildManifest(callback)}).build();

};


/**
 * @description
 * Saves the application to the filesystem. Inside the app folder, specified by the
 * outputFolder property.
 * @param callback that should be called after the build.
 */
App.prototype.saveLocal = function(callback){
  var self = this;


  var _AppSaver = function(app, callback) {
    var that = this;

    /* amount of used frameworks, for this application. */
    that._frameworkCounter = app.frameworks.length;

    /* callback checker, called if all frameworks are build. */
    that.callbackIfDone = function() {
      if (callback && that._frameworkCounter <= 0){
          callback();
      }
    };

    that.save = function() {

      app.frameworks.forEach(function(framework) {
        framework.save(function(fr) {
          /* count  = -1 if a framework has been saved. */
          that._frameworkCounter -= 1;
          that.callbackIfDone();
        });
      });
    };
  };

  /*
   *  build batch:
   *  1) make output folder structure first.
   *  2) Call AppSaver to write the application data, into the
   *     just generated file structure.
   *  3) Call callback, which prompts the massage: 'Saved application to filesystem!'.
   */
  return this.makeOutputFolder(function(){
        new _AppSaver(self, function(){
         console.log('Saved application to filesystem!');
         console.log("\n");   
        }).save();
  });
};

/**
 * @description
 * Prepare the frameworks and the files, to attache them to the server.
 * @param callback
 */
App.prototype.prepareForServer = function(callback){
    var self = this;
    
    var _AppPreparer = function(app, callback){
        var that  = this;

        /* amount of used frameworks, for this application. */
        that._frameworkCounter = app.frameworks.length;

        /* callback checker, called if all frameworks are build. */
        that.callbackIfDone = function() {
          if (callback && that._frameworkCounter <= 0){
              callback();
          }
        };

        that.prepareForServer = function (){
            app.frameworks.forEach(function(framework){
                framework.prepareForServer(self.server, function(){
                /* count  = -1 if a framework has been prepared for server. */
                that._frameworkCounter -= 1;
                that.callbackIfDone();

                });
            });
        };
    }
    
    new _AppPreparer(self,callback).prepareForServer();
};