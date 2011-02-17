// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      29.10.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var E = require('./e').E,
    App,
    TaskManager = require('./task_manager').TaskManager,
    Framework   = require('./framework').Framework,
    Report      = require('./report').Report,
    Resource    = require('./resource').Resource;


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
 *
 * @extends E
 *
 * @constructor
 */

App = exports.App = function (applicationDirectory,server) {

  /* Properties */

  /* Build configuration */
  this.displayName;
  this.targetQuery;
  this.libraries;

  this.server            = server;
  this.buildVersion      = Date.now();  // timestamp of the build.

  this.clear             = '';
  this.execPath          = '';  //  the a actually folder name, in which the application is located.  
  this.name              = 'defaultName';
  this.theme             = 'deafult';
  this.outputFolder      = 'build'; // name of the output folder, default is 'build'.
  this.environment       = 'Web';

  /* Build switches */  
  this.jslintCheck       = false;
  this.minify            = false;  // uses minfiy task ?! default is false
  this.offlineManifest   = true;   // build with offline manifest ?! default is true

  this.taskChain           = [];
  this.proxies             = [];
  this.supportedLanguages  = [];
  this.excludedFolders     = [];
  this.excludedFiles       = [];
  this.excludedFromCaching = [];  
  this.frameworks          = [];

  this.HEAD_IndexHtml = [],
  this.BODY_IndexHtml = [];  

  this.target    = {};
  this.librariesNamesForIndexHtml = [];
  this.coreNamesForIndexHtml      = [];

  this.manifest  = {
    "cache"   :[],
    "network" :[],
    "fallback":[]
  };

  this.reporter = new Report();  

  if(applicationDirectory){
      this.execPath = applicationDirectory;

         this.loadJSONConfig(); 

  }
  console.log("\n");
};


/*
 * Getting all basic Espresso functions from the root prototype: M
 */
App.prototype = new E();

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
        var config = JSON.parse(this._e_.fs.readFileSync(this.execPath+'/config.json', 'utf8'));
        this.addOptions(config);
        if(config.proxies){
           this.server.proxies = config.proxies; //adding proxies, if present.
        }if(config.m_serverPort){
           this.server.port = config.m_serverPort; //adding specific port, if present.
        }if(config.m_serverHostname){
           this.server.hostname = config.m_serverHostname; //adding specific hostname, if present.
        }
    }catch(ex){
       console.log(this.style.red('ERROR:')+this.style.cyan(' - while reading "config.json", error message: '+ex.message));
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
var that = this,
    _theApplication = [],
    _theApplicationResources,
    _i18n;

  _theApplication = ['app'].map(function(module) {
    var _frameworkOptions  = {};
        _frameworkOptions.path = that.execPath + '/' + module;
        _frameworkOptions.name = that.name+'_App';
        _frameworkOptions.frDelimiter = that.execPath+'/';
        _frameworkOptions.excludedFolders = ['resources'].concat(that.excludedFolders);
        _frameworkOptions.excludedFiles = ['.DS_Store'].concat(that.excludedFiles);
        _frameworkOptions.app = that;
        _frameworkOptions.taskChain = new TaskManager(["preSort","dependency","merge","minify","contentType","manifest"]).getTaskChain();
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
        _frameworkOptions.taskChain = new TaskManager(["contentType","manifest"]).getTaskChain();
       return new Resource(_frameworkOptions);
  });

 this.addFrameworks(_theApplicationResources);

 if(this.supportedLanguages.length >= 1){

     _i18n = ['app/resources/i18n'].map(function(module) {
        var _frameworkOptions  = {};
            _frameworkOptions.path = that.execPath + '/' + module;
            _frameworkOptions.name = 'i18n';
            _frameworkOptions.frDelimiter = that.execPath+'/';
            _frameworkOptions.excludedFolders = that.excludedFolders;
            _frameworkOptions.excludedFiles = ['.DS_Store'].concat(that.excludedFiles);
            _frameworkOptions.app = that;
            _frameworkOptions.taskChain = new TaskManager(["contentType","manifest"]).getTaskChain();
           return new Framework(_frameworkOptions);
        });

       this.addFrameworks(_i18n);
 }

};

/**
 * @description
 * Called when adding The-M-Project to the current build.
 * Loads the files for the core system.
 * @param options
 */
App.prototype.loadTheMProject = function(options) {
var that = this, _theMProject, _theMProjectResources,
    _path_to_the_m_project = (this.touchPath(that.execPath+'/frameworks/The-M-Project'))
                             ? that.execPath+'/frameworks/The-M-Project'
                             : that.execPath+'/frameworks/Mproject';

 /*
  * Getting all The-M-Project core files
  * and generate Framework objects.
  */
 _theMProject = ['core','ui'].map(function(module) {
    var _frameworkOptions  = {};
        _frameworkOptions.path = _path_to_the_m_project+'/modules/' + module;
        _frameworkOptions.name = module;
        _frameworkOptions.app = that;
        _frameworkOptions.frDelimiter = 'modules/';
        _frameworkOptions.excludedFolders = that.excludedFolders;
        _frameworkOptions.excludedFiles = ['.DS_Store'].concat(that.excludedFiles);
         /* Definition of standard build chain for The-M-Project«s core files*/
        _frameworkOptions.taskChain = new TaskManager(["dependency","merge","minify","contentType","manifest"]).getTaskChain();
       return new Framework(_frameworkOptions);
    });

 this.addFrameworks(_theMProject);

  /*
   * Getting the The-M-Project resources and third party frameworks,
   * like: jquery.js or underscore.js
   */
  _theMProjectResources = ['jquery','underscore','themes','bootstrapping'].map(function(module) {
    var _frameworkOptions  = {};
        _frameworkOptions.path = _path_to_the_m_project+'/modules/' + module;
        _frameworkOptions.name = module;
        _frameworkOptions.app = that;
        _frameworkOptions.frDelimiter = 'modules/';
        _frameworkOptions.excludedFolders = that.excludedFolders;
        _frameworkOptions.excludedFiles = ['.DS_Store'].concat(that.excludedFiles);
        _frameworkOptions.taskChain = new TaskManager(["contentType","markCore","manifest"]).getTaskChain();
       return new Framework(_frameworkOptions);
    });

  this.addFrameworks(_theMProjectResources);

  _jquery = ['jquery_mobile'].map(function(module) {
    var _frameworkOptions  = {};
        _frameworkOptions.path = _path_to_the_m_project+'/modules/' + module;
        _frameworkOptions.name = module;
        _frameworkOptions.app = that;
        _frameworkOptions.frDelimiter = 'modules/';
        _frameworkOptions.excludedFolders = that.excludedFolders;
        _frameworkOptions.excludedFiles = ['.DS_Store'].concat(that.excludedFiles);
        _frameworkOptions.taskChain = new TaskManager(["merge", "contentType","markCore","manifest"]).getTaskChain();
       return new Framework(_frameworkOptions);
    });

  this.addFrameworks(_jquery);
};

/**
 * @description
 * Builds the index.html page. Used for loading the application.
 */
App.prototype.buildIndexHTML = function(callback,_frameworkNamesForIndexHtml,_HEAD_IndexHtml) {
var _displayName =  (this.displayName) ? this.displayName : this.name,
    _indexHtml = [];
var that = this;
   _indexHtml.push(
      '<!DOCTYPE html>'
    );

    if(!this.offlineManifest){
       _indexHtml.push(
      '<html>'
     );
    }else{
           _indexHtml.push(
      '<html manifest="cache.manifest">'
        ); 
    }

    _indexHtml.push(
      '<head>'
    );

    if(_HEAD_IndexHtml.length >= 1){
       _HEAD_IndexHtml.forEach(function(head){
            _indexHtml.push(head);
        });

    }else{ // Fallback header information.
      _indexHtml.push(
        '<meta name="apple-mobile-web-app-capable" content="yes">'+
        '<meta name="apple-mobile-web-app-status-bar-style" content="default">'+
        '<link rel="apple-touch-icon" href="/theme/images/apple-touch-icon.png"/>'
      );
    }

    _indexHtml.push(
        '<meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">'+
        '<title>'+_displayName+'</title>'
    );

   // Adding jQuery, jQuery Mobile, jQuery Mobile CSS and underscore.
    this.coreNamesForIndexHtml.forEach(function(entry){
             _indexHtml.push(entry);
    });

 /*  _indexHtml.push(
        '<link type="text/css" href="theme/jquery.mobile-1.0a3.min.css" rel="stylesheet" />'+
        '<script type="text/javascript" src="jquery-1.5.min.js"></script>'+
        '<script type="text/javascript" src="jquery.mobile-1.0a3.min.js"></script>'+
        '<script type="text/javascript" src="underscore-min.js"></script>'
    ); */
   _indexHtml.push(
        '<link type="text/css" href="theme/style.css" rel="stylesheet" />'+
        '<script type="text/javascript" src="core.js"></script>'+
        '<script type="text/javascript" src="ui.js"></script>'
    );
    
    _frameworkNamesForIndexHtml.forEach(function(fr){
        _indexHtml.push('<script type="text/javascript" src="'+fr+'"></script>'+'\n');
    });

    if(this.supportedLanguages.length >= 1){
        this.supportedLanguages.forEach(function(lang){
           _indexHtml.push(
                   '<script src="'+lang+'.js"></script>'
           );
        });
    }

    if((this.environment) && (this.environment === "PhoneGap" )){
       _indexHtml.push('<script type="text/javascript" charset="utf-8" src="phonegap.js"></script>'+
                       '<script language="JavaScript">var PhoneGap = true;</script>');
    }else{
       _indexHtml.push(
                       '<script language="JavaScript">var PhoneGap = false;</script>');
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
    	  '</body>'+
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
                            requestPath :'index.html',
                            contentType : 'text/html',
                            framework: fr, /* the framework, this file belongs to.*/
                            content: _indexHtml
                           })

                  );
  var ar = [];
      ar.push(fr);
  this.addFrameworks(ar);
  callback(null,this.frameworks);
};

/**
 * @description
 * Build a HTML5 valid cache.manifest file.
 * @param callback
 */
App.prototype.buildManifest = function(callback){
var self = this, _cacheManifest = [];


if(!self.offlineManifest){
   callback();
}

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
                       requestPath :'cache.manifest',
                       framework: fr, /* the framework, this file belongs to.*/
                       content: _cacheManifest.join('\n')
                       })
     );
  var ar = [];
      ar.push(fr);
  this.addFrameworks(ar);
  callback(null,this.frameworks);
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
    //console.log('output dir maker called');
    that._folderCounter = 4; /*make 4 folders*/

    that.callbackIfDone = function() {
      if (that._folderCounter === 0){
          callback()
      }
    };

    that.makeOutputDir = function(path) {
      if(that._folderCounter >=1){
        self._e_.fs.mkdir(path, 0777 ,function(err){
           if(err && err.errno !== 17){throw err;}
          that._folderCounter--;
          that.makeOutputDir(path+ self._outP.shift());
        });
      }
      that.callbackIfDone();
    }
  };
 new _OutputDirMaker(callback).makeOutputDir(self._outP.shift());
};



App.prototype.readTargetConfig = function (tar){
var that = this,
    _targetsJSON = this._e_.path.join(this.execPath, 'targets.json');

   try{
        var targets = JSON.parse(this._e_.fs.readFileSync(_targetsJSON, 'utf8'));

        if(targets){
           if(targets[tar.group]){
               var _group = targets[tar.group];
               that.target.group = tar.group;
              if(_group[tar.subGroup]) {
                   var _subGroup = _group[tar.subGroup];
                  
                   if(_subGroup.dedicatedResources){
                      that.target.dedicatedResources = _subGroup.dedicatedResources;
                   }else{
                    that.reporter.warnings.push(this.style.cyan('No dedicatedResources defined, for "')
                                          + this.style.magenta(tar.subGroup)
                                          + this.style.cyan('" using "base" and "'+ tar.group +'" only.'));
                   }
                 
                   if(_subGroup.htmlHeader){
                      that.HEAD_IndexHtml = []; // reset, to override the settings that may be made in config.json
                      that.HEAD_IndexHtml = _subGroup.htmlHeader;
                   }
             }else{
               that.reporter.warnings.push(this.style.cyan('No subGroup defined, for "')
                                          + this.style.magenta(tar.subGroup)
                                          + this.style.cyan('" using "base" and "'+ tar.group +'" only.'));
              }
           }else{
           that.reporter.warnings.push(this.style.cyan('No group ')
                                        //  + this.style.magenta(tar.group)
                                          + this.style.cyan('specified, using "base" only.'));
           }
        }
    }catch(ex){
       if(ex.errno !== 2){ // File not found
         console.log(this.style.red('ERROR:')+this.style.cyan(' - while reading "targets.json", error message: '+ex.message));
         process.exit(1);  
       }
    }

};


App.prototype.addUsedFrameworks = function (usedFrameworks){
var that = this;
  var  _usedFrameworks = usedFrameworks.map(function(module) {
       var _frameworkOptions  = {};
           _frameworkOptions.path = that.execPath+'/frameworks/' + module;
           _frameworkOptions.name = module;
           _frameworkOptions.library = true;
           _frameworkOptions.app = that;
           _frameworkOptions.frDelimiter = 'modules/';
           _frameworkOptions.excludedFolders = that.excludedFolders;
           _frameworkOptions.excludedFiles = ['.DS_Store'].concat(that.excludedFiles);
           _frameworkOptions.taskChain = new TaskManager(["contentType","markLibrary","manifest"]).getTaskChain();
          return new Framework(_frameworkOptions);
       });

  this.addFrameworks(_usedFrameworks);
};

/**
 * @description
 * The function tat builds the application.
 * @param callback that should be called after the build.
 */
App.prototype.build = function(callback){
var self = this,
    _frameworks = [];


if(self.htmlHeader){
   self.HEAD_IndexHtml = self.htmlHeader;
}

if(self.targetQuery){
   this.readTargetConfig(self.targetQuery);
}


if(self.libraries){
   self.libraries.forEach(function(fr){
         _frameworks.push(fr.name);
   });

   self.addUsedFrameworks(_frameworks);
}

var _AppBuilder = function(app, callback) {
    var that = this;
    /* amount of used frameworks, for this application. */
    that._frameworkCounter = app.frameworks.length ;

    /* callback checker, called if all frameworks are built. */
    that.callbackIfDone = function() {
      if (callback && that._frameworkCounter <= 0){
         // console.log('build callback called !');
          callback(null,self.frameworks);
      }
    };

    that.build = function() {
      console.log(self.style.green("Building components:"));
      app.frameworks.forEach(function(framework) {
        framework.build(function(fr) {
          /* count  = -1 if a framework had been built. */
          that._frameworkCounter -= 1;
          console.log(self.style.magenta(fr.name)+self.style.green(': ')+self.style.cyan('done'));
          //console.log(require('util').inspect(fr.files_with_Dependencies, true, 1));
          /* check if callback can be called, the condition ist that all frameworks has been build. */
          that.callbackIfDone();
        });
      });
    };
  };

  /*
   *  Build stack:
   *  1) Build the Application
   *   11) Build each framework
   *  2) Build the index.html
   *  3) Build the cache manifest, after all frameworks had been built.
   *  4) Call callback, which leads to the next step of the build OR server process.
   *
   */
 // new _AppBuilder(self, function(){self.buildIndexHTML(function(){self.buildManifest(callback)},self.librariesNamesForIndexHtml,_HEAD_IndexHtml)}).build();

     self.sequencer(
          function(){
            console.log(self.style.green('Building application: "')+self.style.magenta(this.name)+self.style.green('"'));
            new _AppBuilder(self, this).build();
          },
          function(err,frameworks){
             if(err){throw err;}
             self.prepareHTMLGeneration(this);
          },
          function(err,frameworks){
            if(err){throw err;}
            self.buildIndexHTML(this,self.librariesNamesForIndexHtml,self.HEAD_IndexHtml);
          },
          function(err,frameworks){
            if(err){throw err;}
            self.buildManifest(this);
          },
          function(err,frameworks){
            if(err){throw err;}
             callback();
          }
     );

};


App.prototype.build = function(callback){
var self = this,
    _frameworks = [];


if(self.htmlHeader){
   self.HEAD_IndexHtml = self.htmlHeader;
}

if(self.targetQuery){
   this.readTargetConfig(self.targetQuery);
}


if(self.libraries){
   self.libraries.forEach(function(fr){
         _frameworks.push(fr.name);
   });

   self.addUsedFrameworks(_frameworks);
}

var _AppBuilder = function(app, callback) {
    var that = this;
    /* amount of used frameworks, for this application. */
    that._frameworkCounter = app.frameworks.length ;

    /* callback checker, called if all frameworks are built. */
    that.callbackIfDone = function() {
      if (callback && that._frameworkCounter <= 0){
         // console.log('build callback called !');
          callback(null,self.frameworks);
      }
    };

    that.build = function() {
      console.log(self.style.green("Building components:"));
      app.frameworks.forEach(function(framework) {
        framework.build(function(fr) {
          /* count  = -1 if a framework had been built. */
          that._frameworkCounter -= 1;
          console.log(self.style.magenta(fr.name)+self.style.green(': ')+self.style.cyan('done'));
          //console.log(require('util').inspect(fr.files_with_Dependencies, true, 1));
          /* check if callback can be called, the condition ist that all frameworks has been build. */
          that.callbackIfDone();
        });
      });
    };
  };

  /*
   *  Build stack:
   *  1) Build the Application
   *   11) Build each framework
   *  2) Build the index.html
   *  3) Build the cache manifest, after all frameworks had been built.
   *  4) Call callback, which leads to the next step of the build OR server process.
   *
   */
 // new _AppBuilder(self, function(){self.buildIndexHTML(function(){self.buildManifest(callback)},self.librariesNamesForIndexHtml,_HEAD_IndexHtml)}).build();

     self.sequencer(
          function(){
            console.log(self.style.green('Building application: "')+self.style.magenta(this.name)+self.style.green('"'));
            new _AppBuilder(self, this).build();
          },
          function(err,frameworks){
             if(err){throw err;}
             self.prepareHTMLGeneration(this);
          },
          function(err,frameworks){
            if(err){throw err;}
            self.buildIndexHTML(this,self.librariesNamesForIndexHtml,self.HEAD_IndexHtml);
          },
          function(err,frameworks){
            if(err){throw err;}
            self.buildManifest(this);
          },
          function(err,frameworks){
            if(err){throw err;}
             self.reporter.printReport(); 
             callback();
          }
     );

};

/**
 * @description
 * Sort all resolved entries for index.html.
 * @param callback
 */
App.prototype.prepareHTMLGeneration = function(callback){
var self = this;
    
    self.coreNamesForIndexHtml.push(self.coreNamesOBj['jquery']);
    self.coreNamesForIndexHtml.push(self.coreNamesOBj['bootstrapping']);
    self.coreNamesForIndexHtml.push(self.coreNamesOBj['jquery_mobile']);
    self.coreNamesForIndexHtml.push(self.coreNamesOBj['underscore']);
    self.coreNamesForIndexHtml.push(self.coreNamesOBj['themes']);    

    callback(null,self.frameworks);
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
  this.makeOutputFolder(function(){
        new _AppSaver(self, function(){
         console.log('\n');
         console.log(self.style.green('saving application to filesystem!'));
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

    console.log('\n');
    console.log(self.style.green('=== Server log:'));
    console.log("\n");
    
    new _AppPreparer(self,callback).prepareForServer();
};
