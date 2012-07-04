// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2011 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/*
 * import dependencies 
 */
var Fs = require('fs');
var Util = require('util');
var Path = require('path');
var Sequencer = require('step');
var Style = require('../lib/color');
var Utils = require('../lib/espresso_utils');
var File = require('../core/file').File;
var Renderer = require('../lib/renderer');
var normalize = require('path').normalize;

// TODO: Implement transaction mechanism to roll back on error

var generate = exports.generate = function generate(options) {
  var espressoPath = __dirname + '/..';
  var templatePath = __dirname + '/templates';   
  var templateRenderer = Renderer.createRenderer(templatePath);
  var customConfigPath = options.config;
  var tools = ['config.json']; // array with names of build tools, used in the a new project.
  var outPut = [];
  var path;
  var outPutFiles = [
    { src: 'style.css', dst: 'app/resources/base/style.css' },
    { src: 'appicon.png', dst: 'app/resources/base/images/appicon.png' },
    { src: 'Icon.png', dst: 'app/resources/base/images/Icon.png' },
    { src: 'Icon-72.png', dst: 'app/resources/base/images/Icon-72.png' },
    { src: 'Icon@2x.png', dst: 'app/resources/base/images/Icon@2x.png' },
  ];

  /* Properties */
  var projectName = options.project;
  var isHelloWorldProject = options.example;

  if (options.directory === "$PWD") {
    path = process.cwd() + '/';
  } else {
    path = options.directory + '/';
  }

  /* Output dirs */
  outPut.push(path + projectName);
  outPut.push(path + projectName + '/app');
  outPut.push(path + projectName + '/app/resources');
  outPut.push(path + projectName + '/app/resources/base');    
  outPut.push(path + projectName + '/app/resources/base/images');
  outPut.push(path + projectName + '/frameworks');
  outPut.push(path + projectName + '/frameworks/The-M-Project');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/bootstrapping');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/core');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/core/datastore');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/core/datastore/validators');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/core/foundation');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/core/utility');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/core/utility/cypher_algorithms');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/ui');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/ui/dialogs');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/jquery');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/jquery_mobile');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/jquery_mobile_plugins');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/jquery_mobile_plugins/mobiscroll');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/themes');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/themes/jquery_mobile');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/themes/jquery_mobile/images');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/tmp_themes');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/underscore');
  outPut.push(path + projectName + '/frameworks/The-M-Project/modules/d8');


  /**
   * Helper to generate the folder structure for a new project.
   * @param callback, calling the next helper.
   */
  var makeProjectDir = function makeProjectDir(callback) {
    var projectPath = outPut.shift();
    var folderCount = outPut.length;

    function callbackIfDone() {
      if (folderCount === 0){
        callback(null);
      }
    }

    function makeDir(dirPath) {
      if (!dirPath) {
        return;
      }

      Fs.mkdir(dirPath, 0755, function (err) {
          if (err) {
            // Note: for <node-0.6 the errno was 17!
            /* 17 = error code for: File exists!*/
            if (err.code === 'EEXIST' || err.errno === 17) {
              console.log(Style.cyan('Project with name: ') + Style.magenta('"' + projectName + '"') + Style.cyan(' already exists!'));
              process.exit(1);
            } else {
              throw err;
            }
          }
          folderCount -= 1;
          makeDir(outPut.shift());
          callbackIfDone(null);
        });
    }

    makeDir(projectPath);
  };

  /**
   * Helper to generate and place the build tools: 'm-build' and 'm-server'
   * inside the new projects 'app' folder.
   * @param callback, calling the next helper.
   */
  var generateBuildTools = function generateBuildTools(callback) {
    var templateFile = tools.shift();
    var outputPath = path + projectName + '/' + templateFile;
    /* custom config stuff */
    if(customConfigPath){
      try{
        var c  = JSON.parse(Fs.readFileSync(__dirname + '/templates/' + templateFile, 'utf8'));
        var cc = JSON.parse(Fs.readFileSync(customConfigPath, 'utf8'));
        for(var prop in cc) {
          c[prop] = cc[prop];
        }
        c['name'] = '{{appName}}';
        var content = JSON.stringify(c);
        Fs.writeFileSync(__dirname + '/templates/_config.json', content, 'utf8');
        templateFile = '_config.json';
        outputPath = path + projectName + '/config.json';
      }catch(e){
        templateFile = 'config.json';
      }
    }

    var ctx = {
      espresso: espressoPath,
      appName: projectName
    };

    templateRenderer.render({
        templateFile: templateFile,
        ctx: ctx,
        outputPath: outputPath,
        callback: function(){
          Fs.unlink(__dirname + '/templates/_config.json');
          callback();
        }
      });
  };

  /**
   * Helper to generate the 'main.js' for the new project.
   * @param callback, calling the next helper.
   */
  var generateMainJS = function generateMainJS(callback) {
    var templateFile = 'main.js';
    var outputPath = path + projectName + '/app/main.js';

    if (isHelloWorldProject) {
      templateFile = 'hello_world_main.js';
    }

    var ctx = {
      appName: projectName,
      e_Version: ''
    };

    templateRenderer.render({
        templateFile: templateFile,
        ctx: ctx,
        outputPath: outputPath,
        callback: callback
      });
  };

  /**
   * Helper to 'copy' the Mproject the new crated project.
   * @param callback, calling the next helper.
   */
  var browseProjectFiles = function browseProjectFiles(callback) {
    var folderCount = 0;
    var mProjectPath =  espressoPath + '/frameworks/The-M-Project';
    var mProjectFiles = [];

    function callbackIfDone() {
      if (folderCount === 0) {
        callback(null, mProjectFiles);
      }
    }

    function browse(path) {
      Sequencer(
        function () {
          Fs.stat(path, this);
        },

        function (err, stats) {
          if (err) {
            throw err;
          }

          if (stats.isDirectory()) {
            Fs.readdir(path, this);
          } else {
            mProjectFiles.push(new File({ name: path, path: path }));
            folderCount -= 1;
            callbackIfDone();
          }
        },

        function (err, subPaths) {
          if (err) {
            throw err;
          } 

          subPaths.forEach(function (subpath) {
              /* add 1 to the counter if sub file is NOT a folder*/
              if (subpath.match('\\.')) {
                folderCount += 1;
              }
              browse(Path.join(path, subpath));
            });
        }
      );
    }

    browse(mProjectPath);
  };

  var copyProject = function copyProject(files, callback) {
    var currentFile = files.shift();

    if (currentFile) {
      var fileTarget = currentFile.path.split(normalize('frameworks/'))[1];
      fileTarget = fileTarget.split(currentFile.getBaseName() + currentFile.getFileExtension())[0];
      var streamPath = path + projectName + '/frameworks/' + fileTarget + 
        currentFile.getBaseName() + currentFile.getFileExtension();

      var writeStream = Fs.createWriteStream(streamPath);

      Util.pump(Fs.createReadStream(currentFile.path), writeStream, function (err) {
          if (err) {
            if (err.code === 'ENOENT') {
              // TODO maybe we should check if dir(err.path) is a directory
              //      we didn't create and only then skip this error.

              // ignore files we cannot create due to missing directories:
              // else we'd create them at "Output dirs" above.
            } else {
              throw err;
            };
          };
          copyProject(files);
        });
    }
  };

  /*
   * Build sequence
   */

  Sequencer(
    function () {
      makeProjectDir(this);
    },

    function (err, framework) {
      if (err) {
        throw err;
      }
      generateBuildTools(this);
    },

    function (err) {
      if (err) {
        throw err;
      }
      generateMainJS(this);
    },

    function (err) {
      if (err) {
        throw err;
      }
      browseProjectFiles(this);
    },

    function (err, framework) {
      if (err) {
        throw err;
      }
      copyProject(framework, this);
    },

    function (err, framework) {
      if (err) {
        throw err;
      }
      var callback = this;
      var files = outPutFiles.slice();
      (function copyFiles () {
        if (files.length === 0) {
          callback();
        } else {
          var file = files.pop();
          var fromPath = templatePath + '/' + file.src;
          var toPath = path + projectName + '/' + file.dst;
          copyFile(fromPath, toPath, function (err) {
            if (err) {
              /* I am sad */
            } else {
              Utils.log(toPath + ' generated!');
            };
            copyFiles();
          });
        };
      })();
    },

    function (err) {
      if (err) {
        throw err;
      }
      Util.puts('Project successfully generated!');
    }
  );
};

// the optional callback gets an err argument
function copyFile(oldPath, newPath, callback) {
  var oldFile = Fs.createReadStream(oldPath);
  var newFile = Fs.createWriteStream(newPath);
  newFile.once('open', function () {
    Util.pump(oldFile, newFile, callback);
  });
};
