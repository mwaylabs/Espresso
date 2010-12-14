// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      04.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================



var _l = {},
    Framework,
    File = require('./file').File;
var style = require('../lib/color');

/*
 * The required modules for Framework.
 *
 * sys    = node.js system module
 * fs     = filesystem
 *
 */
_l.fs = require('fs');
_l.sys = require('sys');
_l.path = require('path');


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
 */
Framework = exports.Framework = function(properties) {


  /* Properties */

  /* Build configuration */
  this.buildVersion = null;
  this.combinedScripts = false;
  this.defaultLanguage = 'english';
  this.buildLanguage = 'english';

  /* Local properties */
  this.app = null;
  this.virtual = false;  
  this.path = '';
  this.name = '';
  this.frDelimiter;
  this.excludedFolders = [];  
  this.excludedFiles = [];  
  this.files = [];
  this.mergedFiles=[];
  this.dependencyTrees = [];
  this.taskChain = [];


  /* Adding the properties fot this Frameworks */
  if(properties){
     this.addProperties(properties);
  }
};


/**
 * Sets the Properties for Framework
 * @param properties, the properties for the framework
 */
Framework.prototype.addProperties = function(properties){
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
Framework.prototype.isVirtual = function(){
  return this.virtual;
}


/**
 * @description
 * Browse throw all resources containing in the Framework.
 * Load the found files and attache them to this framework
 * @param path, the path to look for resources.
 * @param callback, the function, that is called after all resources haven been loaded.
 */
Framework.prototype.loadFiles = function(path,callback){
var self = this;

var _FileBrowser = function(framework, callback) {
    var that = this;
    //console.log(self.excludedFiles);
    // String.search(regEx) != -1
     /* keep in track of the files, to load. Execute callback only if all resources are loaded*/
    that._folderCounter = 0;

    that.callbackIfDone = function(){
      if (that._folderCounter <= 0){
          callback(framework.files);
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
    /*
     * The function, that actually browses thru the files, reads and add them. 
     */
    that.browse = function(path) {
      _l.fs.stat(path, function(err, stats) {
        if (err){
          throw err;   
        }else{
          if (stats.isDirectory()) {
            _l.fs.readdir(path, function(err, subpaths) {
                if (err){ throw err;}
                // if folder is empty.
                if(subpaths.length < 1) { that.callbackIfDone(); }

                subpaths.forEach(function(subpath) {
                /* add 1 to the counter if sub file is NOT a folder*/
                    if (subpath.match('\\.')) {that._folderCounter += 1;}
                    that.browse(_l.path.join(path, subpath));
                });
             });
          } else {
            if(that.checkIfFileShouldBeExcluded(path)){
               that._folderCounter -= 1;
               that.callbackIfDone();
            }else{
               _l.fs.readFile(path, function(err, data) { // data is a buffer object, if no encoding was specified!
               if (err){
                 throw err;
               }else{
                 framework.files.push(
                      new File({
                                 frDelimiter: framework.frDelimiter,
                                 name: path,
                                 path: path,
                                 framework: framework,
                                 content: data
                                })

                      );
                 that._folderCounter -= 1;
                 that.callbackIfDone();
                }
               });
            }
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
Framework.prototype.build = function(callback){
var that = this;
console.log(style.green('calling build() for: "')+style.magenta(this.name)+style.green('"'));
    if(that.isVirtual()){ // default = false.
       that.taskChain.run(that,callback);
    }else{
       this.loadFiles(that.path, function(files) {
           // _l.sys.puts("Files for '"+that.name+"' loaded");
            that.taskChain.run(that,callback);
       });
    }
};

/**
 * @description
 * Save framework to local file system.
 * @param callback, function to be called after all files had been saved.
 */
Framework.prototype.save = function(callback){
// TODO: made some refactoring here, to make the save function more "well-arranged".
 var self = this,
     _outputPath = this.app.execPath+'/'+this.app.outputFolder;

 var _FileSaver = function(filesLength, callback) {
 var that = this;
     
    that._fileCounter = filesLength;
    that.callbackIfDone = function() {
      if (that._fileCounter === 0){
          callback();
      }
    };

    that.save = function(files) {
        var _currentFile = files.shift();
        if(that._fileCounter >=1){
          if(_currentFile !== undefined){
            if(_currentFile.isImage()){
               _l.sys.pump(_l.fs.createReadStream(_currentFile.path),
                           _l.fs.createWriteStream(_outputPath+'/'+self.app.buildVersion+'/theme/images/'+_currentFile.getBaseName()+_currentFile.getFileExtension()),
                             function(err){
                               if(err) {throw err}
                               that._fileCounter--;
                               that.save(files);
                             });

            }else if (_currentFile.isStylesheet()){
                 _l.sys.pump(_l.fs.createReadStream(_currentFile.path),
                             _l.fs.createWriteStream(_outputPath+'/'+self.app.buildVersion+'/theme/'+_currentFile.getBaseName()+_currentFile.getFileExtension()),
                                function(err){
                                    if(err) {throw err}
                                    that._fileCounter--;
                                    that.save(files);
                                });

            }else if (_currentFile.isVirtual()){
                 _l.fs.writeFile(_outputPath+'/'+self.app.buildVersion+'/'+_currentFile.getBaseName()+_currentFile.getFileExtension(), _currentFile.content,
                         function(err){
                           if(err) {throw err}
                           that._fileCounter--;
                           that.save(files);
                         });

            }else{
                 var _fileName =  (self.combinedScripts) ? self.name+'.js' : _currentFile.getBaseName()+_currentFile.getFileExtension();

                 _l.fs.writeFile(_outputPath+'/'+self.app.buildVersion+'/'+_fileName, _currentFile.content ,
                   function(err){
                    if(err) {throw err}
                    that._fileCounter--;
                    that.save(files);
                 });

            }


           }

        }
        that.callbackIfDone();
    }
 };
 new _FileSaver(this.files.length, callback).save(this.files);
};

/**
 * @description
 * Attaching the files of a framework to, the server.
 * @param server, the server to prepare the files for.
 * @param callback, the function, that is executed after the prepareForServer() is done.
 */
Framework.prototype.prepareForServer = function(server,callback){
    this.files.forEach(function(file){
        server.files[file.requestPath] = file;
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
Framework.prototype.toString = function() {
    return 'Name: '+this.name + '\n'
          +'Path: '+this.path + '\n';
};



