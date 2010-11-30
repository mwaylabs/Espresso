// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      23.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


/**
 * Definition of NewProjectGenerator prototype.
 */

var _l = {},
    File = require('../core/file').File,
    NewProjectGenerator;


/*
 * The required modules for NewProjectGenerator.
 *
 * sys    = node.js system module
 * fs     = filesystem
 *
 */
_l.fs = require('fs');
_l.sys = require('sys');
_l.path = require('path');
var Mu = require('../lib/mu');



NewProjectGenerator = exports.NewProjectGenerator = function() {


  /* Properties */
  this.projectName = '';
  this.isHelloWorldProject = false;
  this.outputPath='';
  this.espressoPath='';  

  this._tools =[]; // array with names of build tools, used in the a new project.
  this._tools.push('m-build.js');
  this._tools.push('m-server.js');
  this._templatePath = './generator/templates';  // path to mustache templates.


};

/**
 * Make sure, that the arguments ale valid.
 * @param args, the command line arguments to check
 */
NewProjectGenerator.prototype.checkArguments = function(args){
var that = this;
    if(args){
        if(args[2]){  /*getting the -project:<project_name> argument*/
            if(args[2].indexOf('-project:') !== -1){
               var projectName = args[2].split('-project:')[1];
               if(!projectName){
                  _l.sys.puts('No project name given');
                  process.exit(1);
               }else{
                   that.projectName = projectName;
               }
            }else if(args[2].indexOf('-projectHelloWorld:') !== -1){
               var projectName = args[2].split('-projectHelloWorld:')[1];
               if(!projectName){
                  _l.sys.puts('No project name given');
                  process.exit(1);
               }else{
                   that.isHelloWorldProject = true;
                   that.projectName = projectName;
               }               
            }else{
               _l.sys.puts('Unknown argument: "'+args[2]+'"');
                process.exit(1);
            }
        }else{
          _l.sys.puts('No arguments given');
          process.exit(1);
        }
    }
};


/**
 * Generator 'main' function, generates a new project withe the given name via. command line argument:
 * -project:<project name>
 * @param args, the command line arguments.
 */
NewProjectGenerator.prototype.gen = function(args,current_Dir){
var self = this;

this.checkArguments(args);
/*
   args.forEach(function (val, index, array) {
     console.log(index + ': ' + val);
   });*/


    self.outputPath = current_Dir.split('Espresso')[0];

    self.espressoPath = current_Dir;
   
    self._outP = [];
    self._outP.push( self.outputPath+'Apps/'+self.projectName);
    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/app');
    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks');
    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject');
    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules');

    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/core');
    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/core/datastore');
    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/core/datastore/validators');

    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/core/foundation');
    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/core/utility');
    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/core/utility/cypher_algorithms');

    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/ui');
    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/ui/dialogs');

    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/jquery');

    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/jquery_mobile');

    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/themes');
    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/themes/jquery_mobile');
    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/themes/jquery_mobile/images');

    self._outP.push( self.outputPath+'Apps/'+self.projectName+'/frameworks/Mproject/modules/underscore');


    /**
     * Helper to generate the folder structure for a new project.
     * @param callback, calling the next helper.
     */
 var _ProjectDirMaker = function(callback) {
   var that = this;
   that._folderCounter = self._outP.length;

   that.callbackIfDone = function() {
     if (that._folderCounter === 0){
       callback();
     }
   };

   that.makeOutputDir = function(path) {
     if(that._folderCounter >=1){
       _l.fs.mkdir(path, 0777 ,function(err){
         if(err){
           if(err.errno === 17){ /* 17 = error code for: File exists!*/
             _l.sys.puts('Project with name: "'+self.projectName+'" already exists!');
             process.exit(1);
           }else{
             throw err;
           }
         }
         that._folderCounter--;
         that.makeOutputDir(self._outP.shift());
       });
     }
     that.callbackIfDone();
   }
 };

    /**
     * Helper to generate and place the build tools: 'm-build' and 'm-server'
     * inside the new projects 'app' folder.
     * @param callback, calling the next helper.
     */
 var _BuildToolsGenerator = function(callback) {
   var that = this;
   that._folderCounter = 2;

   that.callbackIfDone = function() {
     if (that._folderCounter === 0){
       callback();
     }
    };

   that._generateBuildFiles = function(files) {
     var _templateFile = files.shift();
     /*setting the template sources*/
     Mu.templateRoot = self._templatePath; 

     var ctx = {
          appName: self.projectName
      };

     if(that._folderCounter >=1){
       Mu.render(_templateFile, ctx, {}, function (err, output) {
            if (err) {
                throw err;
            }
            var buffer = '';
            output.addListener('data', function (c) {buffer += c; })
                  .addListener('end', function () {
                    _l.fs.writeFile(self.outputPath+'Apps/'+self.projectName+'/'+_templateFile, buffer, function (err) {
                      if (err){ throw err; }
                      _l.sys.puts(_templateFile+' generated!');
                      /*Making the build tools executable */  
                      _l.fs.chmod(self.outputPath+'Apps/'+self.projectName+'/'+_templateFile, 0777, function (err){
                             if (err){ throw err; }
                        that._folderCounter -= 1;
                        that._generateBuildFiles(files);
                      });

                    });
                  });
       });
     }
     that.callbackIfDone();
   }
 };

    /**
     * Helper to generate the 'main.js' for the new project.
     * @param callback, calling the next helper.
     */
 var _MainJSGenerator = function(callback) {
   var that = this;
   that._folderCounter = 1;

   that.callbackIfDone = function() {
     if (that._folderCounter === 0){
       callback();
     }
   };

   that._generateMainJS = function() {
     /*setting the template sources*/
     Mu.templateRoot = self._templatePath;

     var _templateFile = 'main.js';
       if(self.isHelloWorldProject){
         _templateFile = 'hello_world_main.js';
       }

     var ctx = {
       appName: self.projectName
     };

     if(that._folderCounter >=1){
       Mu.render(_templateFile, ctx, {}, function (err, output) {
            if (err) {
                throw err;
            }

            var buffer = '';
            output.addListener('data', function (c) {buffer += c; })
                  .addListener('end', function () {
                    _l.fs.writeFile(self.outputPath+'Apps/'+self.projectName+'/app/main.js', buffer, function (err) {
                      if (err){ throw err; }
                      _l.sys.puts('main.js generated!');
                        that._folderCounter -= 1;
                        that._generateMainJS();
                    });
                  });
       });
     }
     that.callbackIfDone();
   }

 };

    /**
     * Helper to 'copy' the Mproject the new crated project.
     * @param callback, calling the next helper.
     */
 var _MProjectCopy = function(callback) {
   var that = this;
   that._folderCounter = 0;
   that._MprojectPath =  self.espressoPath+'/frameworks/Mproject';
   that._MprojectFile = [];
   that._filesToExclude = ['.DS_Store']; /*Files that should be excluded*/

   that.callbackIfDone = function() {
     if (that._folderCounter === 0){
       callback(that._MprojectFile);
     }
   };


   that.checkIfFileShouldBeExcluded = function (path){

        var fileBaseName = path.split('/');

        if(that._filesToExclude.indexOf(fileBaseName[fileBaseName.length-1]) === -1){
            return false;
        }else{
            return true;
        }

   }

   that.browse = function(path) {
      _l.fs.stat(path, function(err, stats) {

        if (err){
            throw err;
        }else {

          if (stats.isDirectory()) {
            _l.fs.readdir(path, function(err, subpaths) {

              if (err){
                  throw err;
              }else {
                subpaths.forEach(function(subpath) {
                   if(that.checkIfFileShouldBeExcluded(subpath)){
                   }else{
                      /* add 1 to the counter if sub file is NOT a folder*/
                      if (subpath.match('\\.')) {that._folderCounter += 1;
                           }
                      that.browse(_l.path.join(path, subpath));
                   }

                });
               }
            });

          } else {
                 that._MprojectFile.push(
                  new File({
                             name: path,
                             path: path
                            })

                  );
                that._folderCounter -= 1;
                that.callbackIfDone();
             }


         
        }
      });
   };

    that.copy = function(files) {
        var current_File = files.shift();
        if(current_File !== undefined ){
            var fileTarget = current_File.path.split('frameworks/')[1];
            fileTarget = fileTarget.split(current_File.getBaseName()+current_File.getFileExtension())[0];
            _l.sys.pump(_l.fs.createReadStream(current_File.path),
                    _l.fs.createWriteStream(self.outputPath+'Apps/'+self.projectName+'/frameworks/'+fileTarget+current_File.getBaseName()+current_File.getFileExtension()),
                    function(err){
                        if(err) {throw err}
                        that._folderCounter--;
                        that.copy(files);
                    });




        }
        return '';
    }

     that._MProjectCopy = function() {
     that.browse(that._MprojectPath);
   }

 };

_l.fs.mkdir(self.outputPath+'Apps', 0777, function(err){

    if(err){
      _l.sys.puts(self.outputPath+'Apps');
    }


/*
 * Call stack for the newProjectGenerator
 */
new _ProjectDirMaker(function(){
    new  _BuildToolsGenerator(function(){
         new _MainJSGenerator(function(){
             new _MProjectCopy(function(f){
                 new _MProjectCopy(function(d){
                   //  _l.sys.puts('All done!');
                 }).copy(f)
             })._MProjectCopy()
         })._generateMainJS()
    })._generateBuildFiles(self._tools)
}).makeOutputDir(self._outP.shift());

});

};