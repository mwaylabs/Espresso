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



NewProjectGenerator = exports.NewProjectGenerator = function(properties) {


  /* Properties */
  if(properties){
     this.addProperties(properties);
  }
};


/**
 * Sets the Properties for NewProjectGenerator
 * @param properties, the properties for a new object.
 */
NewProjectGenerator.prototype.addProperties = function(properties){

    var that = this;

    Object.keys(properties).forEach(function (key) {
         that[key] = properties[key];
    });


};

/**
 * Generator 'main' function, generates a new project withe the given name via. command line argument:
 * -project:<project name>
 * @param args, the command line arguments.
 */
NewProjectGenerator.prototype.gen = function(args,current_Dir){
var self = this;

    /*
   args.forEach(function (val, index, array) {
     console.log(index + ': ' + val);
   });
*/
       self._tools =[];
       self._tools.push('m-build.js');
       self._tools.push('m-server.js');

   var _outputPath = current_Dir.split('Espresso')[0]; /*project path*/
   var _projectName = args[2].split('-project:')[1];  /*project name*/

 //   _l.sys.puts('_outputPath =  '+_outputPath);
 //   _l.sys.puts('projectName = '+_projectName);


    self._outP = [];
    self._outP.push(_outputPath+'Apps/'+_projectName);
    self._outP.push(_outputPath+'Apps/'+_projectName+'/app');
    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks');
    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject');
    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject/modules');
    
    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject/modules/core');
    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject/modules/core/datastore');
    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject/modules/core/foundation');
    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject/modules/core/utility');
    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject/modules/core/utility/cypher_algorithms');

    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject/modules/ui');

    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject/modules/jquery');

    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject/modules/jquery_mobile');

    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject/modules/themes');
    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject/modules/themes/jquery_mobile');
    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject/modules/themes/jquery_mobile/images');

    self._outP.push(_outputPath+'Apps/'+_projectName+'/frameworks/Mproject/modules/underscore');


 var _OutputDirMaker = function(callback) {
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
                  _l.sys.puts('Project with name: "'+_projectName+'" already exists!');
                   process.exit(1);
               }else{
                   throw err;
               }
               //console.log(require('util').inspect(err, true, 1));
           }
           that._folderCounter--;
           that.makeOutputDir(self._outP.shift());


      });
      }
      that.callbackIfDone();

    }

  };

   var _GenerateBuildFiles = function(callback) {
    var that = this;
    that._folderCounter = 2;


    that.callbackIfDone = function() {
      if (that._folderCounter === 0){
           callback();
      }
    };

    that._generateBuildFiles = function(files) {
         var file = files.shift();
        /*Template sources*/
        Mu.templateRoot = './generator/templates';

        var ctx = {
          appName: _projectName

        };

      if(that._folderCounter >=1){

        Mu.render(file, ctx, {}, function (err, output) {
          if (err) {
            throw err;
          }

          var buffer = '';

          output.addListener('data', function (c) {buffer += c; })
                .addListener('end', function () {
                 //           _l.sys.puts(buffer);
              _l.fs.writeFile(_outputPath+'Apps/'+_projectName+'/app/'+file, buffer, function (err) {
                                  if (err) throw err;
                                  console.log(file+' generated!');
                                  that._folderCounter -= 1;
                                  that._generateBuildFiles(files);
                   });
               });
        });
            that.callbackIfDone();
      }

    }

  };



new _OutputDirMaker(function(){  /*make folders first*/
    new _GenerateBuildFiles(function(){ /*second step is to generate the build tools*/
        _l.sys.puts('all done');
        })._generateBuildFiles(self._tools);
    }).makeOutputDir(self._outP.shift());

}