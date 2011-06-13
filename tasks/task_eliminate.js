/*!
 * task_eliminate.js
 *
 * Copyright 2011, Panacoda GmbH.  All rights reserved.
 * This file is licensed under the MIT license.
 *
 * @author tv
 */

/**
 * @class
 * Eliminate all files of a framework that are analyzed and not reachable.
 *
 * @extends Task
 */
Task = exports.Task = function () {
  this.name = 'eliminate';
};

Task.prototype = new (require('./task').Task)();

Task.prototype.duty = function (framework, callback) {
  var reachableGraph = framework.app.analysis.reachableGraph;

  if (reachableGraph) {
    console.log('reachableGraph:', reachableGraph);
    framework.files = framework.files.filter(function (file) {
      if (file.analysis && !(file.path in reachableGraph)) {
        console.log('[31;1m' + file.path + '[m');
      };
      return !file.analysis || file.path in reachableGraph;
    });
    framework.files.filter(function (file) {
      console.log('[32;1m' + file.path + '[m');
    });
  };

  return callback(framework);
};

Task.prototype.isReadyToRun = function (framework) {
  return framework.app.analysis;
};
