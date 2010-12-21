// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      23.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var Generator = require('./generator').Generator,
    NewProjectGenerator;

/**
 * @class
 *
 * Definition of NewProjectGenerator prototype.
 * NewProjectGenerator is part of Espressos generators to support
 * a developer with generators for new projects and files.
 *
 * @example
 *
 * Usage:
 *
 * call node m-init.js from inside the Espresso folder
 * There are two parameters, that can be attached:
 *
 * --- commands ---
 * -p, --project [project name]                a new empty project
 * -w, --projectHelloWorld [project name]      a new HelloWorld application
 * -h, --help                                  print this help
 *
 * --- usages ---
 * node m-init.js --project myNewProject       will generate a new project called: 'myNewProject'
 *
 * @extends Generator
 *
 * @constructor
 *
 */
NewProjectGenerator = exports.NewProjectGenerator = function() {

  /* Properties */
  this.projectName = '';
  this.isHelloWorldProject = false;
  this.outputPath='';
  this.espressoPath='';    

  this._tools =[]; // array with names of build tools, used in the a new project.
  this._tools.push('m-build.js');
  this._tools.push('m-server.js');
  this._tools.push('m-gen.js');  
  this._tools.push('config.json');
};


NewProjectGenerator.prototype = new Generator;


/**
 * @description
 * Print the possible commands for the NewProjectGenerator.
 */
NewProjectGenerator.prototype.printHelp = function(){
  console.log(this.style.green("=== m-init.js === "));
  console.log(this.style.green("Espresso command line tool to generate a new project "));
  console.log(this.style.green("\n"));
  console.log(this.style.green("--- commands ---"));
  console.log(this.style.green("-p, --project [project name]                a new empty project"));
  console.log(this.style.green("-w, --projectHelloWorld [project name]      a new HelloWorld application"));
  console.log(this.style.green("-h, --help                                  print this help"));  
  console.log(this.style.green("\n"));
  console.log(this.style.green("--- example ---"));
  console.log(this.style.green("node m-init.js --project myNewProject       will generate a new project called: 'myNewProject'"));
  console.log(this.style.green("\n"));
};


/**
 * @description
 * Make sure, that the arguments are valid.
 * @param {Object} args, the command line arguments
 */
NewProjectGenerator.prototype.dispatchArguments = function(argv) {
var args = argv, self = this;

  switch (true) {
      case (args.help || args.h):
        self.printHelp();
        break;
      case ( (args.project || args.p) && ((typeof args.project === 'string') ||(typeof args.p === 'string'))):
        self.projectName = (args.project) ? args.project : args.p;
        self.genProject(self.projectName);
        break;
      case ((args.projectHelloWorld || args.w) && ((typeof args.projectHelloWorld === 'string') ||(typeof args.w === 'string'))):
        self.projectName = (args.projectHelloWorld) ? args.projectHelloWorld : args.w;
        self.isHelloWorldProject = true;      
        self.genProject(self.projectName);           
        break;
      default:
        self.printHelp();
        break;
  }
};


NewProjectGenerator.prototype.genProject = function(projectName){
  var self = this;

      self._outP = [];
      self._outP.push( self.outputPath+'Apps/'+self.projectName);
      self._outP.push( self.outputPath+'Apps/'+self.projectName+'/app');
      self._outP.push( self.outputPath+'Apps/'+self.projectName+'/app/resources');
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
         self._l.fs.mkdir(path, 0777 ,function(err){
           if(err){
             if(err.errno === 17){ /* 17 = error code for: File exists!*/
               self._l.sys.puts(self.style.cyan('Project with name: ')+self.style.magenta('"'+self.projectName+'"')+self.style.cyan(' already exists!'));
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
     that._folderCounter = 4;

     that.callbackIfDone = function() {
       if (that._folderCounter === 0){
         callback();
       }
      };

     that._generateBuildFiles = function(files) {
       var _templateFile = files.shift();
       /*setting the template sources*/
      self.Mu.templateRoot = self._templatePath;

       var ctx = {
            appName: self.projectName
        };

       if(that._folderCounter >=1){
        self.Mu.render(_templateFile, ctx, {}, function (err, output) {
              if (err) {
                  throw err;
              }
              var buffer = '';
              output.addListener('data', function (c) {buffer += c; })
                    .addListener('end', function () {
                     self._l.fs.writeFile(self.outputPath+'Apps/'+self.projectName+'/'+_templateFile, buffer, function (err) {
                        if (err){ throw err; }
                       self._l.sys.puts(_templateFile+' generated!');
                        /*Making the build tools executable */
                        self._l.fs.chmod(self.outputPath+'Apps/'+self.projectName+'/'+_templateFile, 0777, function (err){
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
       self.Mu.templateRoot = self._templatePath;

       var _templateFile = 'main.js';
         if(self.isHelloWorldProject){
           _templateFile = 'hello_world_main.js';
         }

       var ctx = {
         appName: self.projectName,
         e_Version: self.__version__
       };

       if(that._folderCounter >=1){
         self.Mu.render(_templateFile, ctx, {}, function (err, output) {
              if (err) {
                  throw err;
              }

              var buffer = '';
              output.addListener('data', function (c) {buffer += c; })
                    .addListener('end', function () {
                      self._l.fs.writeFile(self.outputPath+'Apps/'+self.projectName+'/app/main.js', buffer, function (err) {
                        if (err){ throw err; }
                        self._l.sys.puts('main.js generated!');
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
        self._l.fs.stat(path, function(err, stats) {

          if (err){
              throw err;
          }else {

            if (stats.isDirectory()) {
              self._l.fs.readdir(path, function(err, subpaths) {

                if (err){
                    throw err;
                }else {
                  subpaths.forEach(function(subpath) {
                     if(that.checkIfFileShouldBeExcluded(subpath)){
                     }else{
                        /* add 1 to the counter if sub file is NOT a folder*/
                        if (subpath.match('\\.')) {that._folderCounter += 1;
                             }
                        that.browse(self._l.path.join(path, subpath));
                     }

                  });
                 }
              });

            } else {
                   that._MprojectFile.push(
                    new self.File({
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
              self._l.sys.pump(self._l.fs.createReadStream(current_File.path),
                      self._l.fs.createWriteStream(self.outputPath+'Apps/'+self.projectName+'/frameworks/'+fileTarget+current_File.getBaseName()+current_File.getFileExtension()),
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

  self._l.fs.mkdir(self.outputPath+'Apps', 0777, function(err){
      if(err){
        self._l.sys.puts(self.outputPath+'Apps');
      }


/*
 * Call stack for the newProjectGenerator
 */
  new _ProjectDirMaker(function(){
            self.genStyleCSS();
      new  _BuildToolsGenerator(function(){
           new _MainJSGenerator(function(){
               new _MProjectCopy(function(f){
                   new _MProjectCopy(function(d){
                    //END
                   }).copy(f)
               })._MProjectCopy()
           })._generateMainJS()
      })._generateBuildFiles(self._tools)
  }).makeOutputDir(self._outP.shift());

  });
};

NewProjectGenerator.prototype.genStyleCSS = function(cb){
var self = this;
        /*setting the template sources*/
       this.Mu.templateRoot = this._templatePath;
    
       var ctx = {};

       this.Mu.render('style.css', ctx, {}, function (err, output) {
         if (err) { throw err;}
         var buffer = '';
         output.addListener('data', function (c) {buffer += c; })
                .addListener('end', function () {
                   self._l.fs.writeFile(self.outputPath+'Apps/'+self.projectName+'/app/resources/style.css', buffer, function (err) {
                     if (err){ throw err; }
                     self._l.sys.puts('style.css generated!');
                     //cb();
                   });
                });
       });
};

/**
 * @description
 * Generator 'main' function, generates a new project withe the given name via. command line argument:
 * -project:<project name>
 * @param args, the command line arguments.
 */
NewProjectGenerator.prototype.gen = function(args,current_Dir){
    this.espressoPath = current_Dir;
    this.outputPath = current_Dir.split('Espresso')[0];
    this.dispatchArguments(this.argv);
};