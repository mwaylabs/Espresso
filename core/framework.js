// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: �2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      04.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var E = require('./e').E;
var File = require('./file').File;
var normalize = require('path').normalize;

/**
 * @class
 *
 * A Framework is the JavaScript object representation of a collection of File objects.
 * A typically Framework would be "The-M-Project" core data or the application that is implemented with it.
 * A Framework is responsible for loading all files, that belongs to this framework.
 * Each Framework contains information of how to build its files.
 * This information is shipped over from the App object which the Framework belongs to.
 *
 * @param properties, the properties for the framework
 *
 * @extends E
 *
 * @constructor
 */
var Framework = exports.Framework = function (properties) {

  /* Properties */

  /* Build configuration */
  this.buildVersion    = null;
  this.combinedScripts = false;

  /* Local properties */
  this.app     = null;
  this.virtual = false;
  this.library = false;
  this.is_a_plugin  = false;
  this.path = '';
  this.name = '';
  this.frDelimiter = '';
  this.excludedFolders = [];
  this.excludedFiles   = [];
  this.files           = [];
  this.mergedFiles     = [];
  this.dependencyTrees = [];
  this.taskChain       = [];
  this.filesToPreload  = [];
  this.preloader       = true;

  /* Adding the properties fot this Frameworks */
  if (properties) {
    this.addProperties(properties);
  }
};

/*
 * Getting all basic Espresso functions from the root prototype: M
 */
Framework.prototype = new E();

/**
 * Sets the Properties for Framework
 * @param properties, the properties for the framework
 */
Framework.prototype.addProperties = function (properties) {
  var that = this;
  Object.keys(properties).forEach(function (key) {
      that[key] = properties[key];
    });
};


/**
 * @description
 * Check if the this framework is virtual, which means it contains only 'virtual' files.
 * Virtual files, are generated during the build process, and have no 'real' data
 * on the hard disk.
 *
 * @return true, if this framework is virtual.
 */
Framework.prototype.isVirtual = function () {
  return this.virtual;
};

/**
 * @description
 * Reads the content of the files connected to a framework.
 * Needs a array with File objects, to read the content.
 *
 * @param callback {function}, the callback function.
 */
Framework.prototype.readFiles = function (callback) {
  var self = this;
  var resourceCounter = self.files.length;

  if (self.files.length === 0) {
    callback(null, self.files);
  }

  function callbackIfDone() {
    if (resourceCounter <= 0) {
      callback(null, self.files);
    }
  }

  self.files.forEach(function (file) {
      var _cFPath  = file.path;

      // data is a buffer object, if no encoding was specified!
      self._e_.fs.readFile(_cFPath, function (err, data) {          if (err) {
            throw err;
          } else {
            file.content = data;
            resourceCounter -= 1;
            callbackIfDone();
          }
        });
    });
};

/**
 * @description
 * Delegates reading of needed files to the appropriate method
 * @param path, the path to look for resources.
 * @param callback, the function, that is called after all resources haven been loaded.
 */
Framework.prototype.getFiles = function getFiles(path, callback) {
  var that = this;
  var manifest = path + '/manifest.json';
  this._e_.fs.stat(manifest, function (err, stat) {
      if (err) {
        that.browseFiles(path, callback);
      } else {
        that.readManifest(manifest, path, callback);
      }
    });
};

Framework.prototype.readManifest = function readManifest(manifest, path, callback) {
  var that = this;
  this._e_.fs.readFile(manifest, 'utf8', function (err, content) {
      if (err) {
        throw err;
      }
      try {
        that.files = JSON.parse(content).manifest.map(function (file) {
            if (that.touchPath(path + '/' + file)) {
              return new File({
                  frDelimiter: that.frDelimiter,
                  name: path + '/' + file,
                  path: path + '/' + file,
                  framework: that
                });
            } else {
              console.log("\n");
              console.log(that.style.red('ERROR:')+that.style.green(' File "')+that.style.cyan(path.split(that.frDelimiter)[1] + '/' + file)
                + that.style.green('" was referenced in "') + that.style.cyan(path.split(that.frDelimiter)[1] + '/'+'manifest.json')
                + that.style.green('" but not found in directory. '));
              console.log("\n");
              process.exit(1); /* exit the process, reason: file not found*/
            }
          });
        callback(null);
      } catch (ex) {
        callback(ex);
      }
    });
};

/**
 * @description
 * Browse throw all resources containing in the Framework.
 * Load the found files and attache them to this framework
 * @param path, the path to look for resources.
 * @param callback, the function, that is called after all resources haven been loaded.
 */
Framework.prototype.browseFiles = function (path, callback) {
  var self = this;

  var _FileBrowser = function (framework, callback) {
    var that = this;
    /* keep in track of the files, to load. Execute callback only if all resources are loaded*/
    that._folderCounter = 0;

    that.callbackIfDone = function () {
      if (that._folderCounter <= 0) {
        callback(null);

      }
    };

    /*
     * Check if a file path contains a file that should not be in the final build.
     * @param path, the path to check.
     */
    that.checkIfFileShouldBeExcluded = function (path) {
      path = normalize(path);
      // exclude hidden files
      if (/\/\.[\w]+\/(\.[\w]+)?/.test(path)) {
        return true;
      }
      var _fileBaseName = path.split(normalize('/'));
      if (that.checkIfFolderShouldBeExcluded(path)) {
        return true;
      }
      return !(self.excludedFiles.indexOf(_fileBaseName[_fileBaseName.length - 1]) === -1);
    };

    /*
     * Check if a file path contains a folder, that should be excluded.
     */
    that.checkIfFolderShouldBeExcluded = function (path) {

      var ret = false;
      self.excludedFolders.forEach(function (folder) {
          // Replace() escapes backslashes of DOS-style paths to not interfere
          // with JavaScript's RegExp.
          // We should probably escape all magic characters...
          var pattern =
              new RegExp(normalize('/' + folder + '/').replace(/\\/g, '\\\\'));
          if (path.search(pattern) !== -1) {
            ret = true;
          }
        });
      return ret;
    };

    that.browse = function (path) {
      that._folderCounter += 1;
      self._e_.fs.stat(path, function (err, stats) {
          that._folderCounter -= 1;
          if (err) {
            throw err;
          } else {
            if (stats.isDirectory()) {
              that._folderCounter += 1;
              self._e_.fs.readdir(path, function (err, subpaths) {
                  that._folderCounter -= 1;
                  if (err) {
                    throw err;
                  }
                  if (subpaths.length === 0) {
                    that.callbackIfDone();
                  }
                  subpaths.forEach(function (subpath) {
                      that.browse(self._e_.path.join(path, subpath));
                    });
                });
            } else {
              if (!that.checkIfFileShouldBeExcluded(path)) {
                framework.files.push(
                  new File({
                      frDelimiter: framework.frDelimiter,
                      name: path,
                      path: path,
                      framework: framework
                    })
                );
              }
              that.callbackIfDone();
            }
          }
        });
    };
  };

  return new _FileBrowser(this, callback).browse(path);
};


/**
 * @description
 * Building the framework, included all files.
 * This function loads all resources, and runs the task chain on this files.
 * @param callback, the function, that is called after all resources haven been build.
 */
Framework.prototype.build = function (callback) {
  var that = this;

  console.log(this.style.green('calling build() for: "') + this.style.magenta(this.name) + this.style.green('"'));

  if (that.isVirtual()) { // default = false.
    that.taskChain.run(that, callback);
  } else {
    that.sequencer(
      function () {
        that.getFiles(that.path, this);
      },

      function (err) {
        if (err) {
          throw err;
        }
        // console.dir(this);
        that.readFiles(this);
      },

      function (err, files) {
        if (err) {
          throw err;
        }
        that.taskChain.run(that, callback);
      }
    );
  }
};

/**
 * @description
 * Save framework to local file system.
 * @param callback, function to be called after all files had been saved.
 */
Framework.prototype.save = function (callback) {
  var self = this,
  _outputPath = this.app.applicationDirectory + '/' + this.app.outputFolder + '/' + self.app.buildVersion;

  /*
   * Helper, to save files of a framework.
   */
  var _FileSaver = function (filesLength, callback) {
    var that = this,
    _fileCounter = filesLength;

    that.callbackIfDone = function () {
      if (_fileCounter === 0) {
        callback();
      }
    };

    that.copyFile = function (files, filePath, fileOutputPath) {
      self._e_.sys.pump(self._e_.fs.createReadStream(filePath),
        self._e_.fs.createWriteStream(fileOutputPath),
        function (err) {
          if (err) {
            throw err;
          }
          _fileCounter--;
          that.callbackIfDone();
        });
      that.save(files);
    };

    that.writeFile = function (files, fileOutPutPath, content) {
      self._e_.fs.writeFile(fileOutPutPath, content,
        function (err) {
          if (err) {
            throw err;
          }
          _fileCounter--;
          that.callbackIfDone();
        });
      that.save(files);
    };

    that.save = function (files) {
      that.callbackIfDone();
      var _cF = files.shift();

      if (_cF !== undefined) {
        switch (true) {
        case (_cF.isWebfont()):
          that.copyFile(files, _cF.path, _outputPath + '/theme/' + _cF.getBaseName() + _cF.getFileExtension());
          break;
        case (_cF.isImage()):
          that.copyFile(files, _cF.path, _outputPath + '/theme/images/' + _cF.getBaseName() + _cF.getFileExtension());
          break;
        case (_cF.isStylesheet()):
          (_cF.containsMergedContent) ?
          that.writeFile(files,  _outputPath + '/theme/' + _cF.getBaseName() + _cF.getFileExtension(), _cF.content) :
          that.copyFile(files, _cF.path, _outputPath + '/theme/' + _cF.getBaseName() + _cF.getFileExtension());
          break;
          /*
           case (_cF.isSASS_Stylesheet()):
             that.writeFile(files, _outputPath+'/theme/'+_cF.getBaseName()+'.css', _cF.content);
             break; */
          // case (_cF.isVirtual()):
        default:
          var _fileName =  (self.combinedScripts) ? self.name + '.js' : _cF.getBaseName() + _cF.getFileExtension();
          that.writeFile(files, _outputPath + '/' + _fileName, _cF.content);
          break;
        }
      }
    };
  };

  new _FileSaver(this.files.length, callback).save(this.files);
};

/**
 * @description
 * Attaching the files of a framework to the server.
 * @param server, the server to prepare the files for.
 * @param callback, the function, that is executed after the prepareForServer() is done.
 */
Framework.prototype.prepareForServer = function (server, callback) {
  var appName = this.app.name;
  this.files.forEach(function (file) {
      if (!server.files) {
        server.files = {};
      }
      server.files['/' + appName + '/' + file.requestPath] = file;
    });
  callback();
};


/**
 * @description
 * Override Object.toString()
 * @exampleText
 * Name: core
 * Path: /user/foo/bar/.../core
 * @return {string} a readable presentations of this framework object.
 */
Framework.prototype.toString = function () {
  return 'Name: ' + this.name + '\n' + 'Path: ' + this.path + '\n';
};
