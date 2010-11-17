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
                  /*RegExp = all string match: m_require('someFile.js');*/
                  _re = new RegExp("[^//]m_require\\([\"'](.*?)[\"']\\)", "g");

                  while (_match = _re.exec(file.content)) {
                    _path = _match[1];
                    if (!/\.js$/.test(_path)){
                        _path += '.js';
                    }
                      deps.push(_path)
                  }
                  if(deps.length >= 1){
                      file.dependencies = deps;
                   //   framework.files_with_Dependencies.push(file);
                  }else{
                   //   framework.files_without_Dependencies.push(file);
                  }
              }
            });

      return framework;
      },
       /*Tree based sort*/
      function sortDependencies(err, fr) {

         if (err){throw err;}

          var that = this;

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
                that.file = file; /*The file attached to this node*/
                that.children = [];

                that.addChildeNode = function(childNode){
                    that.children.push(childNode);
                }

                that.getChildeNodes = function(){
                   return that.children;
                }
            }

           var roots = [];

           fr.files.forEach(function (file){
                if(file.isJavaScript() && file.dependencies.length === 0){
                  _l.sys.puts(file.getBaseName());
                   roots.push(new _TreeNode(file.getName(),file));
                }
           });

           /* find and add the root node first!*/
          // fr.files.forEach(function (file){
          //      if(file.isJavaScript() && file.getBaseName() === 'm'){
                  // _rootNode = new _TreeNode(file.getBaseName(),file);
          //         _rootNode = new _TreeNode(file.getName(),file);
          //      }
          // });



          /**
           * Helper object to compute a tree of all files, according to there dependencies.
           * 
           * @param f the framework
           */
         var _TreeBuilder = function(f) {
            var that = this;
                that.files =  f;
            /**
             * Function of _TreeBuilder, to build ... wait for it ... the tree.
             * @param node the current node to check, starts with root node.
             */
            that.buildTree = function(node){
                 that.files.forEach(function(file){
                     file.dependencies.forEach(function (dep){
                          if(file.getName() !== node.name){ /* don«t use itself as a dependency*/
                             if(dep === node.name){
                                 /* adding child nodes, looking for children of that child node as well. */
                                 node.addChildeNode(that.buildTree(new _TreeNode(file.getName(),file)));
                             }
   
                          }
                     })

                 });

                 return node

             }

         };

         var depsTrees = [];

          roots.forEach(function (root){

              fr.dependencyTrees.push(new _TreeBuilder(fr.files).buildTree(root));

          });


     
    //   _l.sys.puts(print(depsTrees[0],''));
    //   _l.sys.puts(print(depsTrees[1],''));


         /*setting the dependency tree to the framework*/
       //  fr.dependencyTree = new _TreeBuilder(fr.files).buildTree(_rootNode);


//  console.log(require('util').inspect(fr.dependencyTree, true, 1));
         /*shifting the framework to the next step in the sequencer*/
         return fr;

      },
      function mergeFiles(er,fr) {

      var _queue  = [];

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

      fr.dependencyTrees.forEach(function (tree){

                 _l.sys.puts(print(tree,''));
       });


      

      /**
       * Helper object, to traverse the dependency tree based on the 'Breadth-first' search algorithm.
       * See at: http://en.wikipedia.org/wiki/Breadth-first_search
       *
       * The result of the merge function is a list in which sequencer the files of a framework
       * should be include in the single-final output file.
       *
       * @param tree the root node of the framework«s dependency tree.
       */
      var _Merger = function(done) {
             var that = this;
             var _done = done;
              /*The return value, orderedFiles contains the files of a framework in ordered sequence
               *according to the files dependencies.*/
          /**
           * The merge function is taking care of the actually merge process
           * @param done the array, containing all file names, that have already been merged.
           * @param queue storage of all un-merged files.
           */
           that.merge = function(orderdFiles,queue){
               /* if the queue is empty, the walk trough the tree is complete
                * return the ordered files, so the files can finally be merged. */
               if(queue.length === 0){
                  return orderdFiles;
               }else{
                  /*Get the next node in the  queue*/
                  var _currentNode = queue.shift();
                  /*Get the dependencies of the current node*/
                  var _currentNode_Deps = _currentNode.file.dependencies;
                  /*Set the dependency found-counter for the next round  back to: 0
                   *The counter is used to determine if all dependencies of a particular
                   *node have been saved in the orderedFiles Array.
                   *If NOT, the current node/file can«t yet be written to the orderedFiles array. */
                  var _deps_found  = 0;
                    for(var i = 0; i < _currentNode_Deps.length; i++ ){
                         /* check if all dependencies are already done*/
                         for(var x = 0; x < _done.length; x++ ){
                              if(_done[x] === _currentNode_Deps[i] ){
                               _deps_found++;
                              }
                         }
                    }
                     /* check if all dependencies of a file have already been written to orderdFiles.
                      * If NOT all file dependencies are included do it later ! */
                    if(_deps_found === _currentNode_Deps.length) { 
                        /*Take care that a node is only singular in the orderedFiles array */
                         if(_done.indexOf(_currentNode.name) === -1){
                            _done.push(_currentNode.name);
                            orderdFiles.push(_currentNode);
                         }
               
                    }

                    /*adding all direct child nodes to the queue*/
                    var _q = _currentNode.getChildeNodes();

                    if(_q !== undefined){
                       _q.forEach(function(queuee){
                          /*Pushing the the children ad the end of the queue*/
                          queue.push(queuee);
                      });

                    }
                    /*Calling merge recursively.*/
                      return that.merge(orderdFiles,queue);
               }
           }
      };

      var _files_with_dependencies = [];

      var merger  =   new _Merger([]);

      fr.dependencyTrees.forEach(function (tree){

         var _queue =  [] ;
             _queue.push(tree);
         var _done = merger.merge([],_queue);
             _done.forEach(function(d){
                   _files_with_dependencies.push(d.file);

             });
      });


     /*Pushing the root node on the the queue.*/
  //   _queue.push(fr.dependencyTree);
     /*Merge the files*/
  //   var _done =  new _Merger().merge([],_queue);

  //   var _files_with_dependencies = [];
  //   _done.forEach(function(d){
  //        _files_with_dependencies.push(d.file);

  //   });

      /*Merging the files WITH and WITHOUT dependencies together again*/
      fr.files = _files_with_dependencies;
      //    if(fr.files_without_Dependencies.length >= 1){
      //      fr.files_without_Dependencies.forEach(function(file_with_no_dependency){
      //            fr.files.push(file_with_no_dependency);
      //       });

      //    }
      return fr;
     

    }
 );


  return framework;

};

 