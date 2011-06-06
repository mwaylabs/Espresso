/*!
 * task_mergeApp.js
 *
 * Copyright 2011, Panacoda GmbH.  All rights reserved.
 * This file is licensed under the MIT license.
 *
 * @author tv
 */

var Task = require('./task').Task;
var Task_Merge = require('./task_merge').Task_Merge;
var reach = require('../lib/graph').reach;

/**
 * @class
 * This Task appends all cached and reachable files to the framework and
 * delegates merging to Task_Merge.
 *
 * @extends Task
 */
var Task_MergeApp = exports.Task = function () {
  this.name = 'mergeApp';
};

Task_MergeApp.prototype = new Task();

Task_MergeApp.prototype.duty = function duty(framework, callback) {

  // TODO this enterprise sleep (setTimeout(..., 1000)) is required, because
  // Espresso has no inter-task dependencies, yet
setTimeout(function () {

  // get global state
  var _defs = framework.app.globalState.definitions;
  var _refs = framework.app.globalState.references;
  var _files = framework.app.globalState.files;

  // construct file dependency graph
  var _deps = {};

  Object.keys(_refs).forEach(function (ref_key) {
    _deps[ref_key] = {};
    _refs[ref_key].forEach(function (def_key) {
      _deps[ref_key][_defs[def_key]] = true;
    });
  });

  Object.keys(_deps).forEach(function (key) {
    _deps[key] = Object.keys(_deps[key]);
  });

  // collect root files
  var _root_files = {};
  framework.files.forEach(function (file) {
    _refs[file.path].forEach(function (ref_key) {
      // root files are all files, that define objects used by this framework
      // (where this framework is "the Application").
      _root_files[_defs[ref_key]] = true;
    });
  });
  if (typeof framework.app.deadCodeElimination !== 'boolean') {
    // By contract framework.app.deadCodeElimination is either a boolean or
    // an array of (fully qualified) object names (e.g. M.Application).
    // If it is not a boolean, then iterate over all the names, and collect
    // add their defining files to the root files.
    framework.app.deadCodeElimination.forEach(function (key) {
      _root_files[_defs[key]] = true;
    });
  };
  _root_files = Object.keys(_root_files);

  //console.log('DEPENDENCY GRAPH');
  //console.log(_deps);

  //console.log('DEFINITIONS');
  //console.log(Object.keys(_refs).length);
  //console.log(Object.keys(_refs));

  //console.log('REFERENCES');
  //console.log(reach(_deps, _root_files).length);
  //console.log(reach(_deps, _root_files));

  //console.log('FRAMEWORK FILES');
  //console.log(framework.files.map(function (f) { return f.path }));

  // push all cached and reachable files to this framework
  reach(_deps, _root_files).forEach(function (path) {
    framework.files.push(_files[path]);
  });

  // delegate
  Task_Merge.prototype.duty.call(this, framework, callback);
}, 1000);
};
