// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      05.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


/**
 * Definition of Task_Dependency.
 *
 */


var _l = {},
    Task_Dependency,
    Task = require('./Task').Task;
    File = require('../core/file').File;

/*
 * The required modules for Task_Dependency.
 *
 * sys    = node.js system module
 * fs     = filesystem
 *
 */
_l.sys = require('sys');



Task_Dependency = exports.Task_Dependency = function() {


  /* Properties */
  this.name = 'dependencie_task';
  this.deps = [];

};

/**
 * Get the run() function from Task
 * @param framework
 */
Task_Dependency.prototype = new Task;


/**
 * The duty of this task.
 * @param framework the reference to the framework this task is working with. 
 */
Task_Dependency.prototype.duty = function(framework) {
var that = this;
_l.sys.puts('Running Task: "dependency"');
 this.TaskSequencer.sequenceThat(
      function fetchDependencies() {
          framework.files.forEach(function(file) {
              if(file.isJavaScript()){
                 var _re, _match, _path;
                 var deps = [];


                  _re = new RegExp("m_require\\([\"'](.*?)[\"']\\)", "g");

                  while (_match = _re.exec(file.content)) {
                    _path = _match[1];
                    if (!/\.js$/.test(_path)){
                        _path += '.js';
                    }
                      deps.push(_path)
                  //  _dependenciesObject.dependencies.push(_path);
                  }

                  file.dependencies = deps;


                 // framework.filesDependencies[file.getBaseName()] = _dependenciesObject;
              }
            });

      return framework;
      },
       /*Tree based sort*/
      function sortDependencies(err, fr) {
         if (err){throw err;}


            fr.files.forEach(function (file){
                if(file.isJavaScript() ){
              //    _l.sys.puts(file.getBaseName()+' -> '+file.dependencies);
                }
           });

            var _fileTree = new Object();
            
            var _treeNode = function(nodeName) {
                var that = this;
                that.nodeName = nodeName;
                that.children = [];

                that.addChildeNode = function(childNode){
                    that.children.push(childNode);
                }

                that.getChildeNodes = function(){
                   return that.children;
                }

                this.toString = function(){
                  var  it = this.nodeName+'\n';

                    this.children.forEach(function (child){
                         it +=' -'+ child.nodeName;

                     });

                    return it;
                }
            }

            //var _node

            /* finding and adding the root node!*/
           fr.files.forEach(function (file){
                if(file.isJavaScript() && file.getBaseName() === 'm'){
                   _fileTree = new _treeNode(file.getBaseName());
                }
           });





          var _nodeBrowser = function(f) {
             var that = this;
                 that.files =  f;

             that.browse = function(node){
                   that.files.forEach(function(file){
                       file.dependencies.forEach(function (dep){
                            if(file.getBaseName() !== node.nodeName){
                             //   _l.sys.puts("dep = "+dep)
                               if(dep === node.nodeName+'.js'){
                                   node.addChildeNode(that.browse(new _treeNode(file.getBaseName())));
                               }
   
                            }
                       })
                        //    that.browse(node);
                   });
/*
                   node.getgetChildeNodes.forEach(function(childNode){

                          that.browse(childNode);  
                   });
*/      
                    return node

             }

          };


              var ro =  new _nodeBrowser(fr.files).browse(_fileTree);
          //    console.log(require('util').inspect(ro, true, null));
//_l.sys.puts(ro);
//          console.log(require('util').inspect(ro, true, null));

              function print(node,string){

             //    string += ' '+node.nodeName+' \n';
                  string += '+';
                  var it = node.nodeName+' \n'


                 if (node.children){
                      node.children.forEach(function (child){
                        it += print(child,string);

                     });

                 }
                  
                 return string+' '+it;


              }


         _l.sys.puts(print(ro,''));

      }
  );

return framework;



};

