// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      22.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================



var E = require('./e').E,
    Resource,
    Framework   = require('./framework').Framework,
    File = require('./file').File;


/**
 * @class
 *
 * @param properties, the properties for the framework
 *
 * @extends E
 *
 * @constructor
 */
Resource = exports.Resource = function(properties) {

  /* Properties */
  this.__resourceBase__  = '/base';
  this.deviceGroup       = '';
  this.device            = '';

  this.markedResources = [];

  this._BASE_              = true;
  this._BASE_GROUP_        = false;
  this._BASE_GROUP_DEVICE_ = false;

  /* Adding the properties fot this Frameworks */
  if(properties){
     this.addProperties(properties);
  }
};

/*
 * Getting all basic Espresso functions from the root prototype: M
 */
Resource.prototype = new Framework;

/**
 * @description
 * Gather the resources for a project and a specific device.
 * @param cb {function}, called after this function is done.
 */
Resource.prototype.gatherResources = function (cb){
var that = this;
  that.sequencer(
     function evaluateTargetConfig(){
        return that.evaluateTargetConfig();
      },
      function readDeviceSpecific(){
        that.browseFiles(that.path+'/'+that.deviceGroup+'/'+that.device,that._BASE_GROUP_DEVICE_,this);
      },
      function readGroupSpecific(err,obj){
        if(err){console.log(err); throw err;}
        if(obj){console.log(obj)}
        that.browseFiles(that.path+'/'+that.deviceGroup,that._BASE_GROUP_,this);
      },
      function readBase(err,obj){
        if(err){console.log(err); throw err;}
        if(obj){console.log(obj)}
        that.browseFiles(that.path+that.__resourceBase__,that._BASE_ ,this);
      },
      function done(err,obj){
        if(err){console.log(err); throw err;}
        if(obj){console.log(obj)}
        that.listResources();
        cb(null,that.files);
      }
  );
};

/**
 * @description
 * Evaluate the target configuration for the current build, if any present.
 * If no configuration is present, only the 'resources/base/' directory is used.
 *
 * @example
 * A example entry in the projects 'config.json'
 * 
 * "target":{
 *    "manufacturer": "apple",
 *    "resolution"  : "640x960"
 *  }
 *
 */
Resource.prototype.evaluateTargetConfig = function(){
var _target = this.app.target;
console.log('target = ');
console.log(_target);

 if(_target){
     if(_target.manufacturer){
       this._BASE_GROUP_ = true;
       this.deviceGroup  = _target.manufacturer;
     }
     if(_target.resolution && _target.manufacturer){
        this._BASE_GROUP_DEVICE_ = true;
        this.device = _target.resolution;
     }
 }else{
     this._BASE_ = true;
 }
 return true;
};

/**
 * @description
 * Function to browse the resources of a project.
 *
 * @param path {string}, the path, to look for resources.
 * @param should_run {boolean}, indicates if this function should browser the resources
 * @param cb {function}, called after this function is done.
 */
Resource.prototype.browseFiles = function(path,should_run,cb){
var self = this;

  var _FileBrowser = function(cb) {
    var that = this;
    this._resourceCounter = 0;

    that.callbackIfDone = function(){
      if (that._resourceCounter <= 0){
          cb();
      }
    };

    /*
     * Check if a file path contains a file that should not be in the final build.
     * @param path, the path to check.
     */
    that.checkIfFileShouldBeExcluded = function (path){
        var _fileBaseName = path.split('/');
        if(that.checkIfFolderShouldBeExcluded(path)){
            return true;
        }
        if(self.excludedFiles.indexOf(_fileBaseName[_fileBaseName.length-1]) === -1){
            return false;
        }else{
            return true;
        }
    };

    /*
     * Check if a file path contains a folder, that should be excluded.
     */
    that.checkIfFolderShouldBeExcluded = function (path){
        var _exclude = false;
        self.excludedFolders.forEach(function(folder){
             if(path.search('/'+folder+'/') !== -1){
                _exclude = true;
             }
        });
        return _exclude;
    };

    that.browse = function(path) {
       that._resourceCounter += 1;
       self._l.fs.stat(path, function(err, stats) {
            that._resourceCounter -= 1;
        if (err){
          throw err;
        }else{
          if (stats.isDirectory()) {
            that._resourceCounter += 1;
            self._l.fs.readdir(path, function(err, subpaths) {
                  that._resourceCounter -= 1;
                if (err){ throw err;}
                subpaths.forEach(function(subpath) {
                    that.browse(self._l.path.join(path, subpath));
                });
             });

          } else {
           if(!that.checkIfFileShouldBeExcluded(path)){
              var newResource = new File({
                                 frDelimiter: self.frDelimiter,
                                 name: path,
                                 path: path,
                                 framework: self
                                });
              if(self.markedResources.indexOf(newResource.getBaseName()) === -1){
                self.files.push(newResource);
                self.markedResources.push(newResource.getBaseName());
              }

           }   
           that.callbackIfDone();
          }
        }
      });
    };
  }

 if(should_run){
   return new _FileBrowser(cb).browse(path);
 }else{
   cb();  
 }

};

/**
 * @description
 * Print the path of all used resources.
 */
Resource.prototype.listResources = function(){
var that = this;
    console.log(this.style.green("=== used resouces ==="));
    this.files.forEach(function(file){
        console.log(that.style.cyan(file.path.split(that.frDelimiter)[1]));
    });
};

/**
 * @description
 * Building the framework, included all files.
 * This function loads all resources, and runs the task chain on this files.
 * @param callback, the function, that is called after all resources haven been build.
 */
Resource.prototype.build = function(callback){
var that = this;

    console.log(this.style.green('calling build() for: "')
               +this.style.magenta(this.name)
               +this.style.green('"'));

    if(that.isVirtual()){ // default = false.
       that.taskChain.run(that,callback);
    }else{
     that.sequencer(
         function gatherResources(){
           that.gatherResources(this);
         },
         function(err,files){
            if(err){throw err;}
            that.readFiles(files,this);
         },
         function taskChain(err,files){
           if(err){throw err;}
           that.taskChain.run(that,callback);
         }
     );
    }
};




