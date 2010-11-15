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
_l.fs = require('fs');



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
                  
                  _re = new RegExp("[^//]m_require\\([\"'](.*?)[\"']\\)", "g");

                  while (_match = _re.exec(file.content)) {
                    _path = _match[1];
                    if (!/\.js$/.test(_path)){
                        _path += '.js';
                    }
                      deps.push(_path)
                  }

                  file.dependencies = deps;
                  framework.filesDependencies[file.getBaseName()] = deps;
              }
            });

      return framework;
      },
       /*Tree based sort*/
      function sortDependencies(err, fr) {
         if (err){throw err;}

           /*object to hold the root node.*/
            var _rootNode = {};

          /**
           * Helper object to generate nodes.
           *
           * @param nodeName - the node«s name
           * @param file - the file, represented by this node.
           */
            var _TreeNode = function(nodeName,file) {
                var that = this;
                that.name = nodeName;
                that.file = file;
                //that.siblings = [];
                that.children = [];

                that.addChildeNode = function(childNode){
                    that.children.push(childNode);
                }

                that.getChildeNodes = function(){
                   return that.children;
                }
            }

            /* finding and adding the root node!*/
           fr.files.forEach(function (file){
                if(file.isJavaScript() && file.getBaseName() === 'm'){
                   _rootNode = new _TreeNode(file.getBaseName(),file);
                }
           });

          /**
           * Helper object to compute a tree of all files, according to there dependencies.
           * 
           * @param f the framework
           */
          var _TreeBuilder = function(f) {
             var that = this;
                 that.files =  f;

             that.buildTree = function(node){
                   that.files.forEach(function(file){
                       file.dependencies.forEach(function (dep){
                            if(file.getBaseName() !== node.name){
                             //   _l.sys.puts("dep = "+dep)
                               if(dep === node.name+'.js'){
                                   node.addChildeNode(that.buildTree(new _TreeNode(file.getBaseName(),file)));
                               }
   
                            }
                       })

                   });

                    return node

             }

          };

         /*setting the dependency tree to the framework*/
         fr.dependencyTree = new _TreeBuilder(fr.files).buildTree(_rootNode);

         /*shifting the framework to the next step in the sequencer*/
         return fr;

      },
      function mergeFiles(er,fr) {

      var mergedFile = '';
      var queue  = [];
      /*
      function print(node,string){
                  string += '+';
                  var it = node.name+' \n'
                 if (node.children){
                      node.children.forEach(function (child){
                        it += print(child,string);
                     });
                 }
                 return string+' '+it;
              }

      */
      //  _l.sys.puts(print(fr.dependencyTree,''));


      /**
       * Helper object, to traverse the dependency tree based on the 'Breadth-first' search algorithm.
       * See at: http://en.wikipedia.org/wiki/Breadth-first_search
       *
       * The result of the merge function is a list in which sequencer the files of a framework
       * should be include in the single-final output file.
       *
       * @param tree the root node of the framework«s dependency tree.
       */
      var _Merger = function(tree) {
             var that = this;
             var nodes = tree
             var orderdFiles = []; /*The return value*/

          /**
           * The merge function is taking care of the actually merge process
           * @param done the array, containing all file names, that have already been merged.
           * @param queue storage of all un-merged files.
           */
             that.merge = function(done,queue){
                 if(queue.length === 0){
                     _l.sys.puts('--------------- ALL DONE  ---------------');
                     return orderdFiles;
                 }else{
                    var currentNode = queue.shift();
               //   _l.sys.puts('done =' + done);
               //   _l.sys.puts('currentNode =' + currentNode.name);
               //      console.log(require('util').inspect(currentNode, true, 1));
                    var currentNode_Deps = currentNode.file.dependencies;
               //   _l.sys.puts(currentNode_Deps);
                    var deps_found  = 0;
                    for(var i = 0; i < currentNode_Deps.length; i++ ){
               //    _l.sys.puts('currentNode_Deps.length = '+currentNode_Deps.length);
               //    _l.sys.puts('currentNode_Deps[i] ->'+currentNode_Deps[i]);
               //   console.log(require('util').inspect(done, true, 1));

                         for(var x = 0; x < done.length; x++ ){
                              if(done[x] === currentNode_Deps[i] ){
                               deps_found++;
                              }
                         }
                    }

                     if(deps_found === currentNode_Deps.length || currentNode.name === 'm' ){
                         if(done.indexOf(currentNode.name+'.js') === -1){
                              //done[currentNode.name+'.js']= currentNode.name+'.js';
                             done.push(currentNode.name+'.js');
                             orderdFiles.push(currentNode);
                            _l.sys.puts(' +++++++++++++ '+ currentNode.name+ ' is done');
                         }
               
                     }/*else{
                          _l.sys.puts(' ############# '+currentNode.name+ ' is NOT done');
                   //      wait.push(currentNode.name+'.js');
                   //    _l.sys.puts(' ############# '+wait);
                     }*/

                     /*adding all direct child nodes to the queue*/
                     var q = currentNode.getChildeNodes();

                     if(q !== undefined){
                      q.forEach(function(queuee){
                           queue.push(queuee);
                      });

                      return that.merge(done,queue);
                     }
                 }
             }

          };


         queue.push(fr.dependencyTree)

     var done =  new _Merger(fr.dependencyTree).merge([],queue);

     /*Combining all the files, contained in the result of merging process */
     done.forEach(function(d){

     _l.sys.puts(d.name);
     mergedFile += d.file.content;

     });

      _l.fs.writeFile(fr.name+'.js', mergedFile, function (err) {
              if (err) throw err;
              console.log('It\'s saved!');
      });

    }
 );

return framework;



};

