// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      04.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================



var E = require('./e').E,
    Framework,
    File = require('./file').File;



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
Framework = exports.Framework = function(properties) {

  /* Properties */

  /* Build configuration */
  this.buildVersion    = null;
  this.combinedScripts = false;

  /* Local properties */
  this.app     = null;
  this.virtual = false;  
  this.path = '';
  this.name = '';
  this.frDelimiter;
  this.excludedFolders = [];  
  this.excludedFiles   = [];
  this.files           = [];
  this.mergedFiles     = [];
  this.dependencyTrees = [];
  this.taskChain       = [];


  /* Adding the properties fot this Frameworks */
  if(properties){
     this.addProperties(properties);
  }
};

/*
 * Getting all basic Espresso functions from the root prototype: M
 */
Framework.prototype = new E;

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
      self._l.fs.stat(path, function(err, stats) {
        if (err){
          throw err;   
        }else{
          if (stats.isDirectory()) {
            self._l.fs.readdir(path, function(err, subpaths) {
                if (err){ throw err;}
                // if folder is empty.
                if(subpaths.length < 1) { that.callbackIfDone(); }

                subpaths.forEach(function(subpath) {
                /* add 1 to the counter if sub file is NOT a folder*/
                    if (subpath.match('\\.')) {that._folderCounter += 1;}
                    that.browse(self._l.path.join(path, subpath));
                });
             });
          } else {
            if(that.checkIfFileShouldBeExcluded(path)){
               that._folderCounter -= 1;
               that.callbackIfDone();
            }else{
               self._l.fs.readFile(path, function(err, data) { // data is a buffer object, if no encoding was specified!
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
console.log(this.style.green('calling build() for: "')+this.style.magenta(this.name)+this.style.green('"'));
    if(that.isVirtual()){ // default = false.
       that.taskChain.run(that,callback);
    }else{
       this.loadFiles(that.path, function(files) {
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
var self = this,
    _outputPath = this.app.execPath+'/'+this.app.outputFolder+'/'+self.app.buildVersion;

 /*
  * Helper, to save files of a framework.  
  */
 var _FileSaver = function(filesLength, callback) {
  var that = this,
      _fileCounter = filesLength;
     
    that.callbackIfDone = function() {
      if (_fileCounter === 0){
          callback();
      }
    };

    that.copyFile = function(files,filePath, fileOutPutPath){
     self._l.sys.pump(self._l.fs.createReadStream(filePath),
                 self._l.fs.createWriteStream(fileOutPutPath),
                   function(err){
                     if(err) {throw err}
                     _fileCounter--;
                     that.callbackIfDone();
                   });
     that.save(files);
    };

    that.writeFile = function(files,fileOutPutPath, content){
     self._l.fs.writeFile(fileOutPutPath,content,
                function(err){
                    if(err) {throw err}
                    _fileCounter--;
                    that.callbackIfDone();
                });
     that.save(files);
    };

    that.save = function(files) {
     that.callbackIfDone();   
     var _cF = files.shift();
     if(_cF !== undefined){
      switch (true) {
        case (_cF.isImage()):
          that.copyFile(files,_cF.path,_outputPath+'/theme/images/'+_cF.getBaseName()+_cF.getFileExtension());
          break;
        case (_cF.isStylesheet()):
          that.copyFile(files,_cF.path,_outputPath+'/theme/'+_cF.getBaseName()+_cF.getFileExtension());
          break;
        case (_cF.isVirtual()):
        default:
          var _fileName =  (self.combinedScripts) ? self.name+'.js' : _cF.getBaseName()+_cF.getFileExtension();
          that.writeFile(files,_outputPath+'/'+_fileName,_cF.content);
          break;
      }
     }
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



