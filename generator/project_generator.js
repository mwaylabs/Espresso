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
    
  this._templatePath = __dirname + '/templates';   
      
  /* Properties */
  this.projectName = '';
  this.isHelloWorldProject = false;
  this.outputPath='';
  this.espressoPath='';    

  this._tools =[]; // array with names of build tools, used in the a new project.
  this._tools.push('m-build.js');
  this._tools.push('m-server.js');
  this._tools.push('m-dev-server.js');
  this._tools.push('m-gen.js');
  this._tools.push('config.json');
};


NewProjectGenerator.prototype = new Generator();


/**
 * @description
 * Print the possible commands for the NewProjectGenerator.
 */
NewProjectGenerator.prototype.printHelp = function(){
  console.log(this.style.green("=== m-init.js === "));
  console.log(this.style.green("Espresso v"+this.__version__));  
  console.log(this.style.green("command line tool to generate a new project "));
  console.log(this.style.green("\n"));
  console.log(this.style.green("--- commands ---"));
  console.log(this.style.green("-p, --project [project name]                a new empty project"));
  console.log(this.style.green("-w, --projectHelloWorld [project name]      a new HelloWorld application"));
  console.log(this.style.green("-d, --dir [custom project directory]        a custom project directory"));
  console.log(this.style.green("-h, --help                                  print this help"));  
  console.log(this.style.green("\n"));
  console.log(this.style.green("--- example usage---"));
  console.log(this.style.green("node m-init.js --project myNewProject                  will generate a new project called: 'myNewProject'"));
  console.log(this.style.green("node m-init.js -p myNewProject -d /Users/Foo/Work      will generate a new project in /Users/Foo/Work"));
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
      case ((args.project || args.p) && ((typeof args.project === 'string') ||(typeof args.p === 'string'))):
        self.projectName = (args.project) ? args.project : args.p;
        self.genProject(self.projectName,argv);
        break;
      case ((args.projectHelloWorld || args.w) && ((typeof args.projectHelloWorld === 'string') ||(typeof args.w === 'string'))):
        self.projectName = (args.projectHelloWorld) ? args.projectHelloWorld : args.w;
        self.isHelloWorldProject = true;      
        self.genProject(self.projectName,argv);           
        break;
      default:
        self.printHelp();
        break;
  }
};


NewProjectGenerator.prototype.genProject = function(projectName,args){
 var self = this;
     self.path = self.outputPath+'Apps/';  
    
      switch(true){
          case((args.dir || args.d) && ((typeof args.dir === 'string') ||(typeof args.d === 'string'))):
             var t = (args.dir) ? args.dir : args.d;            
             self.path = t+'/';   
          break;
          default:
             self.path = self.outputPath+'Apps/';   
      }

    
      self._outP = [];
    
      self._outP.push( self.path + self.projectName );
      self._outP.push( self.path + self.projectName + '/app' );
      self._outP.push( self.path + self.projectName + '/app/resources' );
      self._outP.push( self.path + self.projectName + '/app/resources/base' );    
      self._outP.push( self.path + self.projectName + '/frameworks' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/core');
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/core/datastore' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/core/datastore/validators' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/core/foundation' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/core/utility' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/core/utility/cypher_algorithms' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/ui' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/ui/dialogs' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/jquery' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/jquery_mobile' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/themes' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/themes/jquery_mobile' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/themes/jquery_mobile/images' );
      self._outP.push( self.path + self.projectName + '/frameworks/The-M-Project/modules/underscore' );



      /**
       * Helper to generate the folder structure for a new project.
       * @param callback, calling the next helper.
       */
   var _ProjectDirMaker = function(callback) {
     var that = this;
     that._folderCounter = self._outP.length;

     that.callbackIfDone = function() {
       if (that._folderCounter === 0){
         callback(null,{});
       }
     };

     that.makeOutputDir = function(path) {
       if(that._folderCounter >=1){
         self._e_.fs.mkdir(path, 0777 ,function(err){
           if(err){
             if(err.errno === 17){ /* 17 = error code for: File exists!*/
               self._e_.sys.puts(self.style.cyan('Project with name: ')+self.style.magenta('"'+self.projectName+'"')+self.style.cyan(' already exists!'));
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
     that._folderCounter = 5;

     that.callbackIfDone = function() {
       if (that._folderCounter === 0){
         callback(null,{});
       }
      };

     that._generateBuildFiles = function(files) {
       var _templateFile = files.shift();
       /*setting the template sources*/
      self.Mu.templateRoot = self._templatePath;

       var ctx = {
            espresso: self.espressoPath,
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
                     self._e_.fs.writeFile(self.path+self.projectName+'/'+_templateFile, buffer, function (err) {
                        if (err){ throw err; }
                       self._e_.sys.puts(_templateFile+' generated!');
                        /*Making the build tools executable */
                        self._e_.fs.chmod(self.path+self.projectName+'/'+_templateFile, 0777, function (err){
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
         callback(null,{});
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
                      self._e_.fs.writeFile(self.path+self.projectName+'/app/main.js', buffer, function (err) {
                        if (err){ throw err; }
                        self._e_.sys.puts('main.js generated!');
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
     that._MprojectPath =  self.espressoPath+'/frameworks/The-M-Project';
     that._MprojectFile = [];
     that._filesToExclude = ['.DS_Store']; /*Files that should be excluded*/

     that.callbackIfDone = function() {
       if (that._folderCounter === 0){
         callback(null,that._MprojectFile);
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
        self._e_.fs.stat(path, function(err, stats) {

          if (err){
              throw err;
          }else {

            if (stats.isDirectory()) {
              self._e_.fs.readdir(path, function(err, subpaths) {

                if (err){
                    throw err;
                }else {
                  subpaths.forEach(function(subpath) {
                     if(that.checkIfFileShouldBeExcluded(subpath)){
                     }else{
                        /* add 1 to the counter if sub file is NOT a folder*/
                        if (subpath.match('\\.')) {that._folderCounter += 1;
                             }
                        that.browse(self._e_.path.join(path, subpath));
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
              self._e_.sys.pump(self._e_.fs.createReadStream(current_File.path),
                      self._e_.fs.createWriteStream(self.path+self.projectName+'/frameworks/'+fileTarget+current_File.getBaseName()+current_File.getFileExtension()),
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

  self._e_.fs.mkdir(self.outputPath+'Apps', 0777, function(err){
      if(err){
         console.log("\n");
         console.log(self.style.green('New project at: "')+self.style.cyan(self.path+self.projectName));
         console.log("\n");  
      }


    /*
     * Call stack for the newProjectGenerator
     */
      self.sequencer(
         function(){
            new _ProjectDirMaker(this).makeOutputDir(self._outP.shift());
         },
         function(err,framework){
            if(err){throw err;}
            self.genStyleCSS();
            new _BuildToolsGenerator(this)._generateBuildFiles(self._tools);
         },
         function(err,framework){
            if(err){throw err;}
            new _MainJSGenerator(this)._generateMainJS();
         },
         function(err,framework){
            if(err){throw err;}
            new _MProjectCopy(this)._MProjectCopy();
         },
         function(err,framework){
            if(err){throw err;}
            new _MProjectCopy(this).copy(framework);
         },
         function(err,framework){
            if(err){throw err;}
           //Done
         }
      );
  });
};

NewProjectGenerator.prototype.genStyleCSS = function(cb){
var self = this;
    
    //__dirname + '/templates
        /*setting the template sources*/
       this.Mu.templateRoot = this._templatePath;
    
       var ctx = {};

       this.Mu.render('style.css', ctx, {}, function (err, output) {
         if (err) { throw err;}
         var buffer = '';
         output.addListener('data', function (c) {buffer += c; })
                .addListener('end', function () {
                   self._e_.fs.writeFile(self.path+self.projectName+'/app/resources/base/style.css', buffer, function (err) {
                     if (err){ throw err; }
                     self._e_.sys.puts('style.css generated!');
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