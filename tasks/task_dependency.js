// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      05.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var Task = require('./task').Task;
var File = require('../core/file').File;
var normalize = require('path').normalize;

/**
 * @class
 * 
 * The Dependency Task is responsible for calculating dependencies between the JavaScript files
 * contained in the framework ('core' and 'ui') and the concrete Application.
 * Therefor each file, that has some dependencies to one or more other files must provide a special tag, which indicates the dependencies.
 * In JavaScript functions and objects used in file must be specified some where above the first execution.
 * @example
 * function a (){
 *   alert('function a');
 * }
 *
 * a(); // will work.
 * b(); // will probably not work.
 *
 * function b (){
 *   alert('function b');
 * }
 *
 * @description
 * So the business of the dependency task is to take care, that the JavaScript files of both, the project and the framework
 * are included in the right sequence. The information about the sequence is carried in each file.
 * Its done by adding:
 * m_require('name_to_dependency.js');
 * at the top of a JavaScript file. To place m_require at the very begin of a file is not mandatory,
 * the Dependency Task will find it any way, but it makes developing much easier when looking for dependencies.
 *
 * @extends Task
 */
Task_Dependency = exports.Task_Dependency = function() {
  /* Properties */
  this.name = 'dependencie_task';
  this.deps = [];
};

/**
 * Get the run() function from Task
 * @param framework
 */
Task_Dependency.prototype = new Task();

//TODO: Spilt the duty function into 4 functions, to gain maintainability.
/**
 * The duty of this task.
 * @param framework the reference to the framework this task is working with. 
 */
Task_Dependency.prototype.duty = function(framework,cb) {
  var that = this;

  this.sequencer(
    /*Resolve all dependencies for all JavaScript files, contained in a framework*/
    function resolveDependencies() {
      framework.files.forEach(function(file) {
          if(file.isJavaScript()){
            var _re, _match, _path;
            var _deps = [];
            /*RegExp = all string match: m_require('someFile.js');
             * ^[/\*]+\s*m_require
             * */
            _re = new RegExp("m_require\\([\"'](.*?)[\"']\\)", "g");
            var f = file.content.toString();
            while (_match = _re.exec(file.content)) {
              //     console.log('match : '+_match);
              _path = _match[1];
              if (!/\.js$/.test(_path)){
                _path += '.js';
              }
              _deps.push(_path)
            }
            if(_deps.length >= 1){
              /*Add the found dependencies to the file.*/
            //console.log(_deps);
            file.dependencies = _deps;
          }
        }
      });

    return framework;
  },
  /*Tree based sort*/
            function buildDependencyTrees(err,fr) {

              var that = this,_roots = [];   // _roots = object to hold the root nodes.
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

            /* find and add the root nodes first!*/
            fr.files.forEach(function (file){
                if(file.isJavaScript() && file.dependencies.length === 0){
                  _roots.push(new _TreeNode(file.getName(),file));
                }
              });

            /**
             * Helper object to compute a tree of all files,
             * according to there dependencies.
             * @param f, the framework
             */
            var _TreeBuilder = function(f) {
              var that = this;
              that.files = f;
              /**
               * Function of _TreeBuilder, to build ... wait for it ... the tree.
               * @param node the current node to check, starts with root node.
               */
            that.buildTree = function(node){
              that.files.forEach(function(file){
                  file.dependencies.forEach(function (dep){
                      if(file.getName() !== node.name){ /* don«t use itself as a dependency*/
                        if (normalize(dep) === node.name) {
                          /* adding child nodes, looking for children of that child node as well. */
            node.addChildeNode(that.buildTree(new _TreeNode(file.getName(),file)));
          }
        }
      })

  });
return node
           }

         };

         /* setting the dependency tree to the framework*/
            _roots.forEach(function (rootNode){
                fr.dependencyTrees.push(new _TreeBuilder(fr.files).buildTree(rootNode));
              });

            return fr; // shifting the framework to the next step in the sequencer

          },
          function iCanHazCircle (err,fr){
            fr.files.forEach(function(file){
                var _currentFile = file.getName();
                fr.files.forEach(function(aFile){
                    if(file.dependencies.indexOf(aFile.getName()) !== -1){
                      if(aFile.dependencies.indexOf(file.getName()) !== -1){
                        console.log('\n');
                        console.log(that.style.red('ERROR:')+that.style.green(" circle in 'm_require' chain!"));
                        console.log(that.style.cyan(file.getName() + that.style.green(' has a dependency on ') +that.style.cyan(aFile.getName())));
                        console.log(that.style.cyan(aFile.getName()+ that.style.green(' has a dependency on ') +that.style.cyan(file.getName())));
                        console.log('\n');
                        process.exit(1); /* exit the process, reason: circle in m_require chain*/
                      }
                    }
                  });

              });
            return fr;
          },
          /*Sort the found dependencies*/
            function sortDependencies(err,fr) {
              var _queue  = []; // the queue, needed for the tree sort algorithm.
              var _sortedFiles = []; // holds the sort result.
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
              /*
               fr.dependencyTrees.forEach(function (tree){
               this._e_.sys.puts(print(tree,''));
             });
             */
            /*
             * Helper object, to traverse the dependency tree based on the 'Breadth-first' search algorithm.
             * See at: http://en.wikipedia.org/wiki/Breadth-first_search
             *
             * The result of the merge function is a list in which sequencer the files of a framework
             * should be include in the single-final output file.
             */
            var _Merger = function(done) {
              var that = this;
              var _done = done;
              /**
               * The merge function is taking care of the actually merge process
               * @param done the array, containing all file names, that have already been merged.
               * @param queue storage of all un-merged files.
               */
            that.merge = function(orderdFiles,queue){
              /* if the queue is empty, the walk trough the tree is complete
               * return the ordered files, so the files can finally be merged. */
            if(queue.length === 0){
              /*The return value, orderedFiles contains the files of a framework in ordered sequence
               *according to the files dependencies.*/
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
              if (normalize(_done[x]) === normalize(_currentNode_Deps[i])) {
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

      var _merger = new _Merger([]);

      /* Merge files for every  formed dependency tree.*/
            fr.dependencyTrees.forEach(function (tree){
                _queue = []; //  reset _queue for each tree
                _queue.push(tree); // pushing the root node on the the queue.
                /*Merge the files*/
            var _done = _merger.merge([],_queue);
            _done.forEach(function(d){
                _sortedFiles.push(d.file);

              });
          });

        /*attache the merged and sorted files to the framework*/
            fr.files = _sortedFiles;
            cb(fr);

          }
        );
      };
