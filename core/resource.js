// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: 2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      22.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/* jslint white: true, onevar: false, undef: true, nomen: false, eqeqeq: false, plusplus: false, bitwise: true, regexp: true, newcap: false immed: false, strict: false */

var E = require('./e').E;
var Framework = require('./framework').Framework;
var File = require('./file').File;


/**
 * @class
 *
 * @param properties, the properties for the framework
 *
 * @extends E
 *
 * @constructor
 */
var Resource = exports.Resource = function (properties) {

  /* Properties */
  this.__resourceBase__    = '/base';
  this.group               = '';
  this.dedicatedResources  = '';

  this.markedResources = [];
  this.sassStyleSheets = [];

  this._BASE_              = true;
  this._BASE_GROUP_        = false;
  this._BASE_GROUP_DEVICE_ = false;

  this.files = [];

  /* Adding the properties fot this Frameworks */
  if (properties) {
    this.addProperties(properties);
  }
};


/*
 * Getting all basic Espresso functions from Framework
 */
require('sys').inherits(Resource, Framework);


/**
 * @description
 * Gather the resources for a project and a specific device.
 * @param cb {function}, called after this function is done.
 */
Resource.prototype.gatherResources = function (cb) {
  var that = this;
  that.sequencer(
    function evaluateTargetConfig() {
      return that.evaluateTargetConfig();
    },
    function readDeviceSpecific() {
      that.browseFiles(that.path + '/' + that.group + '/' + that.dedicatedResources, that._BASE_GROUP_DEVICE_, true, this);
    },
    function readGroupSpecific(err, obj) {
      if (err) {
        console.log(err);
        throw err;
      }
      if (obj) {
        console.log(obj);
      }
      that.browseFiles(that.path + '/' + that.group, that._BASE_GROUP_, false, this);
    },
    function readBase(err, obj) {
      if (err) {
        console.log(err);
        throw err;
      }
      if (obj) {
        console.log(obj);
      }
      that.browseFiles(that.path + that.__resourceBase__, that._BASE_, true, this);
    },
    function done(err, obj) {
      if (err) {
        console.log(err);
        throw err;
      }
      if (obj) {
        console.log(obj);
      }
      that.listResources();
      cb(null);
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
Resource.prototype.evaluateTargetConfig = function () {
  var _target = this.app.target;
  if (_target) {
    if (_target.group) {
      if(this.touchPath(this.path + '/' + _target.group)){
        this._BASE_GROUP_ = true;
        this.group  = _target.group;
      }else{
        this._BASE_GROUP_ = false;
        this.app.reporter.warnings.push(this.style.cyan('no resource folder found for group: "')
          + this.style.magenta(_target.group)
          + this.style.cyan('" using "base" only'));
      }
    }
    if (_target.dedicatedResources && _target.group) {
      if(this.touchPath(this.path + '/' +  _target.group + '/' + _target.dedicatedResources)){
        this._BASE_GROUP_DEVICE_ = true;
        this.dedicatedResources = _target.dedicatedResources;
      }else{
        this._BASE_GROUP_DEVICE = false;
        this.app.reporter.warnings.push(this.style.cyan('no resource folder found for "')
          + this.style.magenta(_target.group + '/' + _target.dedicatedResources)
          + this.style.cyan('" using "base" and "/'+_target.group+'" only'));
      }
    }
  } else {
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
Resource.prototype.browseFiles = function (path, should_run, allow_sub_folders, cb) {
  var self = this;
  var _FileBrowser = function (cb) {

    var that = this;
    this._resourceCounter = 0;
    this._allowSubFolders = true;
    that.callbackIfDone = function () {
      if (that._resourceCounter <= 0) {
        cb();
      }
    };

    /*
     * Check if a file path contains a file that should not be in the final build.
     * @param path, the path to check.
     */
    that.checkIfFileShouldBeExcluded = function (path) {
      // exclude hidden files
      if (/\/\.[\w]+\/(\.[\w]+)?/.test(path)) {
        return true;
      }
      var _fileBaseName = path.split('/');
      if (that.checkIfFolderShouldBeExcluded(path)) {
        return true;
      }
      return !(self.excludedFiles.indexOf(_fileBaseName[_fileBaseName.length - 1]) === -1);
    };

    /*
     * Check if a file path contains a folder, that should be excluded.
     */
    that.checkIfFolderShouldBeExcluded = function (path) {
      // exclude hidden folders
      if (/\/\.[\w]+\//.test(path)) {
        return true;
      }

      self.excludedFolders.forEach(function (folder) {
          if (path.search('/' + folder + '/') !== -1) {
            return true;
          }
        });
      return false;
    };

    that.browse = function (path) {
      //     console.log(path);
      that._resourceCounter += 1;
      self._e_.fs.stat(path, function (err, stats) {
          that._resourceCounter -= 1;
          if (err) {
            throw err;
          } else {
            if (stats.isDirectory()) {
              if (that._allowSubFolders || allow_sub_folders) {
                that._resourceCounter += 1;
                self._e_.fs.readdir(path, function (err, subpaths) {
                    that._resourceCounter -= 1;
                    if (err) {
                      throw err;
                    }
                    // console.log('Path ='+path+' subpath.length '+subpaths.length+'  _resourceCounter '+that._resourceCounter);
                    if (subpaths.length === 0) {
                      that.callbackIfDone();
                    }
                    subpaths.forEach(function (subpath) {
                        that.browse(self._e_.path.join(path, subpath));
                      });
                  });
                that._allowSubFolders = false;
              } else{
                that.callbackIfDone();
              }
            } else {
              if (!that.checkIfFileShouldBeExcluded(path)) {

                var newResource = new File({
                    frDelimiter: self.frDelimiter,
                    name: path,
                    path: path,
                    framework: self
                  });

                //  if (!newResource.isSASS_Stylesheet()) {
                if (self.markedResources.indexOf(newResource.getBaseName()) === -1) {
                  self.files.push(newResource);
                  self.markedResources.push(newResource.getBaseName());
                }
                //  }else{
                //     self.sassStyleSheets.push(newResource);
                //self.markedResources.push(newResource.getBaseName());
                //  }
              }
              that.callbackIfDone();
            }
          }
        });
    };
  };

  if (should_run) {
    return new _FileBrowser(cb).browse(path);
  } else {
    cb();
  }

};

/**
 * @description
 * Print the path of all used resources.
 */
Resource.prototype.listResources = function () {
  var that = this;
  this.files.forEach(function (file) {
      that.app.reporter.resouces.push(file.path.split(that.frDelimiter)[1]);
      // console.log(that.style.cyan(file.path.split(that.frDelimiter)[1]));
    });
  /*
   this.sassStyleSheets.forEach(function (file) {
   console.log(that.style.cyan(file.path.split(that.frDelimiter)[1]));
 }); */
};

/**
 * @description
 * Merge all found SASS files into one single SASS file.
 *
 * @param files  {array}  the array of containing the found sass files.
 * @param callback {function} the callback to be called after this functions is done.
 */
Resource.prototype.mergeSASSFiles = function (files, callback) {
  var that = this,
  _akku = [];

  if (that.sassStyleSheets.length === 0) {
    callback(null, files);
  } else {
    that.readFiles(that.sassStyleSheets, function (err, f) {
        that.sassStyleSheets.forEach(function (file) {
            _akku += file.content;
          });
        var _newSASSResource = new File({
            name: 'sass',
            path: '/sass.sass',
            extname: '.sass',
            content: _akku.toString(),
            framework: that
          });
        that.sassStyleSheets = [];
        that.sassStyleSheets.push(_newSASSResource);
        callback(null, files);
      });
  }
};

/**
 * @description
 * Building the framework, included all files.
 * This function loads all resources, and runs the task chain on this files.
 * @param callback {function}, the function, that is called after all resources haven been build.
 */
Resource.prototype.build = function (callback) {
  var that = this;

  console.log(this.style.green('calling build() for: "') + this.style.magenta(this.name) + this.style.green('"'));

  // console.log(this.files.length);

  if (that.isVirtual()) { // default = false.
    that.taskChain.run(that, callback);
  } else {
    that.sequencer(
      function gatherResources() {
        that.gatherResources(this);
      },
      function (err, files) {
        if (err) {
          throw err;
        }
        that.readFiles(this);
      },/*
         function mergeSASSFiles(err,files) {
         that.mergeSASSFiles(that.sassStyleSheets,this);
       }, */
      function taskChain(err, files) {
        if (err) {
          throw err;
        }
        that.taskChain.run(that, callback);
      }
    );
  }
};
