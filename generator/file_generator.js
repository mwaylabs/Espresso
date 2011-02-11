// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      14.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================



var Generator = require('./generator').Generator,
    FileGenerator;

/**
 * @class
 *
 * @description
 * Generates new files for a M-Project.
 *
 * @example
 * Commands:
 * -p, --page [pagae name]                a new page
 * -c, --controller [controller name]     a new controller
 * -v, --validator [validator name]       a new validator
 * -m, --model [model name]               a new model
 * -i, --i18n                             two i18n sample files, for 'en_us' & 'de_de'
 * -h, --help                             print this help
 *
 * Usage:
 * ./m-gen.js --page myNewPage            will generate a new page called: 'myNewPage'
 *
 * @constructor
 *
 *
 * @extends Generator
 */
FileGenerator = exports.FileGenerator = function() {
  this.Mu.templateRoot = __dirname + '/templates/'; //this._templatePath; //extending the template path from prototype
};

/**
 * Extending FileGenerator«s prototype by the prototype of <Generator>
 */
FileGenerator.prototype = new Generator;

/**
 * @description
 * Print the possible commands for the FileGenerator.
 */
FileGenerator.prototype.printHelp = function(){
  console.log(this.style.green("=== m-gen.js === "));
  console.log(this.style.green("Espresso v"+this.__version__));
  console.log(this.style.green("command line tool to generate new or additional files for a project "));
  console.log(this.style.green("The generated files containing some sample code, to start coding right away!"));
  console.log(this.style.green("\n"));
  console.log(this.style.green("--- commands ---"));
  console.log(this.style.green("-p, --page [page name]                 a new page"));
  console.log(this.style.green("-c, --controller [controller name]     a new controller"));
  console.log(this.style.green("-v, --validator [validator name]       a new validator"));
  console.log(this.style.green("-m, --model [model name]               a new model"));
  console.log(this.style.green("-i, --i18n                             two i18n sample files, for 'en_us' & 'de_de'"));
  console.log(this.style.green("-h, --help                             print this help"));
  console.log(this.style.green("\n"));
  console.log(this.style.green("--- example usage---"));
  console.log(this.style.green("./m-gen.js --page myNewPage            will generate a new page called: 'myNewPage'"));
  console.log(this.style.green("\n"));
};
/**
 *         case (((args.n && args.v && args.r) || (args.newdevice && args.vendor && args.resolution))
              && ( (typeof args.n === typeof args.v === typeof args.r === 'string')
              || ( typeof args.newdevice === typeof args.vendor === typeof args.resolution === 'string'))):
        self.ge
 * @param argv
 */


/**
 * @description
 * Make sure, that the arguments are valid.
 * @param {Object} args, the command line arguments
 */
FileGenerator.prototype.dispatchArguments = function(argv) {
var args = argv, self = this;
  switch (true) {
      case (args.help || args.h):
        self.printHelp();
        break;
      //case (args.n):
      //  self.genNewTargetDevice(args); //(args.v) ? args.v : args.vendor, (args.r) ? args.r : args.resolution);
      //  break;
      case ((args.page || args.p) && ((typeof args.page === 'string') ||(typeof args.p === 'string'))):
        self.genPage((args.page) ? args.page : args.p);
        break;
      case ((args.controller || args.c) && ((typeof args.controller === 'string') ||(typeof args.c === 'string'))):
        self.genController((args.controller) ? args.controller : args.c);
        break;
      case ((args.validator || args.v) && ((typeof args.validator === 'string') ||(typeof args.v === 'string')) && !args.n):
        self.genValidator((args.validator) ? args.validator : args.v);
        break;
      case ((args.model || args.m) && ((typeof args.model === 'string') ||(typeof args.m === 'string'))):
        self.genModel((args.model) ? args.model : args.m);
        break;
      case ((args.i18n || args.i)):
        self.genI18N();
        break;

      default:
        self.printHelp();
  }
};

/**
 * Checker if a file already exists.
 * @param {String} filePath
 * @param {String} fileName
 * @param {Function} callback
 */
FileGenerator.prototype.doesFilesExist = function(filePath,fileName,callback){
var self = this;
    this._e_.fs.stat(filePath+fileName, function(err, fd){
        if(err){
            callback();
        }else{
          console.log(self.style.red("Error:") + self.style.cyan(" File with name '"+fileName+"' already exitsts"));
          process.exit(1);
        }

    });
};

/**
 * @description
 * Generates a new file for a project.
 * @param {String} templateName
 * The name of the template to use
 * @param {String} fileName
 * The name of the file, specified by the parameter set in m-gen.js
 * @param  {String} filePath
 * The path, where the new file should be written to
 * @param  {String} ctx
 * The context, defines the properties used in the template.
 */
FileGenerator.prototype.generate = function(templateName, fileName, filePath, ctx){
 var self = this;
 this.Mu.render(templateName, ctx, {}, function (err, output) {
        if (err) {
            throw err;
        }
        var buffer = '';
        output.addListener('data', function (c) {buffer += c;})
              .addListener('end', function () {
                self.doesFilesExist(filePath, fileName, function(){
                    self._e_.fs.writeFile(filePath + fileName, buffer, function (err) {
                        if (err) {
                            throw err;
                        }
                        console.log(self.style.green(fileName + ' generated!'));
                   })
                  }
                );
              });
 });
};


FileGenerator.prototype.makeFolder  = function(path, cb){





};

FileGenerator.prototype.genNewTargetDevice = function(n){
var self = this;
//  console.log("venodr = "+vendor +" resolution = "+resolution);
    if(n.v && n.r){
       console.log("vendor = "+n.v +" resolution = "+n.r);
    }
console.log(self._e_.path.join(self.outputPath, '/app/resources/', n.v ));
    if (n.v && n.r){
      self._e_.fs.mkdir(self.outputPath+'/app/resources/'+n.v, 0777 ,function(err){
         if(err){
           if(err.errno === 17){ /* 17 = error code for: folder: controllers exists!, but do it anyway*/
            //  self.generate('controller.js', controllerName+'.js', self.outputPath+'/app/controllers/', _ctx);
               console.log("done");
           }
           else{
             throw err;
           }
         }else{
         // self.generate('controller.js', controllerName+'.js', self.outputPath+'/app/controllers/', _ctx);
         }
      });
   } else {
     this._e_.sys.puts(this.style.red('ERROR:') + this.style.magenta(' no arguments given'));
     this._e_.sys.puts(this.style.cyan('Usage: "-view:\<page name\>"'));
   }

};



/**
 *
 * @param modelName
 */
FileGenerator.prototype.genModel = function(modelName) {
   var self = this,
       _ctx = {
                modelName: modelName,
                appName: self.projectName,
                e_Version: self.__version__
              };

   if (modelName) {
      self._e_.fs.mkdir(self.outputPath+'/app/models', 0777 ,function(err){
         if(err){
           if(err.errno === 17){ /* 17 = error code for: folder: models exists!, but do it anyway*/
              self.generate('model.js', modelName+'.js', self.outputPath+'/app/models/', _ctx);
           }
           else{
             throw err;
           }
         }else{
          self.generate('model.js', modelName+'.js', self.outputPath+'/app/models/', _ctx);
         }
      });
   } else {
     this._e_.sys.puts(this.style.red('ERROR:') + this.style.magenta(' no arguments given'));
     this._e_.sys.puts(this.style.cyan('Usage: "-controller:\<page name\>"'));
   }

};

/**
 * @description
 * Generates a new page for the project.
 * @param pageName
 * The name of the new page
 */
FileGenerator.prototype.genPage = function(pageName) {
   var self = this,
       _ctx = {
                pageName: pageName,
                appName: self.projectName,
                e_Version: self.__version__
              };

   if (pageName) {
      self._e_.fs.mkdir(self.outputPath+'/app/views', 0777 ,function(err){
         if(err){
           if(err.errno === 17){ /* 17 = error code for: folder: views exists!, but do it anyway*/
              self.generate('page.js', pageName+'.js', self.outputPath+'/app/views/', _ctx);
           }
           else{
             throw err;
           }
         }else{
          self.generate('page.js', pageName+'.js', self.outputPath+'/app/views/', _ctx);
         }
      });
   } else {
     this._e_.sys.puts(this.style.red('ERROR:') + this.style.magenta(' no arguments given'));
     this._e_.sys.puts(this.style.cyan('Usage: "-controller:\<page name\>"'));
   }
};

/**
 *
 * @param controllerName
 */
FileGenerator.prototype.genController = function(controllerName) {
   var self = this,
       _ctx = {
                controllerName: controllerName,
                appName: self.projectName,
                e_Version: self.__version__
              };

   if (controllerName){
      self._e_.fs.mkdir(self.outputPath+'/app/controllers', 0777 ,function(err){
         if(err){
           if(err.errno === 17){ /* 17 = error code for: folder: controllers exists!, but do it anyway*/
              self.generate('controller.js', controllerName+'.js', self.outputPath+'/app/controllers/', _ctx);
           }
           else{
             throw err;
           }
         }else{
          self.generate('controller.js', controllerName+'.js', self.outputPath+'/app/controllers/', _ctx);
         }
      });
   } else {
     this._e_.sys.puts(this.style.red('ERROR:') + this.style.magenta(' no arguments given'));
     this._e_.sys.puts(this.style.cyan('Usage: "-view:\<page name\>"'));
   }
};

/**
 *
 * @param validatorName
 */
FileGenerator.prototype.genValidator = function(validatorName){
   var self = this,
       _ctx = {
                validatorName: validatorName,
                appName: self.projectName,
                e_Version: self.__version__
              };

   if (validatorName){
      self._e_.fs.mkdir(self.outputPath+'/app/validators', 0777 ,function(err){
         if(err){
           if(err.errno === 17){ /* 17 = error code for: folder: validators exists!, but do it anyway*/
              self.generate('validator.js', validatorName+'.js', self.outputPath+'/app/validators/', _ctx);
           }
           else{
             throw err;
           }
         }else{
          self.generate('validator.js', validatorName+'.js', self.outputPath+'/app/validators/', _ctx);
         }
      });
   } else {
     this._e_.sys.puts(this.style.red('ERROR:') + this.style.magenta(' no arguments given'));
     this._e_.sys.puts(this.style.cyan('Usage: "-view:\<page name\>"'));
   }

};

/**
 * @description
 * Generating two I18N sample files for: 'en_us' and 'de_de'
 */
FileGenerator.prototype.genI18N = function(){
   var self = this,
       _ctx = {
                appName: self.projectName,
                e_Version: self.__version__
              };

   self._e_.fs.mkdir(self.outputPath+'/app/resources/i18n', 0777 ,function(err){
         if(err){
           if(err.errno === 17){ /* 17 = error code for: folder: i18n exists!, but do it anyway*/
              self.generate('i18n_de_de.js', 'de_de'+'.js', self.outputPath+'/app/resources/i18n/', _ctx);
              self.generate('i18n_en_us.js', 'en_us'+'.js', self.outputPath+'/app/resources/i18n/', _ctx);
           }
           else{
             throw err;
           }
         }else{
          self.generate('i18n_de_de.js', 'de_de'+'.js', self.outputPath+'/app/resources/i18n/', _ctx);
          self.generate('i18n_en_us.js', 'en_us'+'.js', self.outputPath+'/app/resources/i18n/', _ctx);
         }
   });
};

/**
 * @param args
 * @param current_Dir
 */
FileGenerator.prototype.gen = function(args,current_Dir){
    this.outputPath = current_Dir;
    this.setProjectName(current_Dir);
    this.dispatchArguments(this.argv);
};