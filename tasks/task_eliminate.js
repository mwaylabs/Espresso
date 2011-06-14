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
  var red = this.style.red;
  var green = this.style.green;
  var bold = this.style.bold;
  var log = function () {
    framework.app.log.apply(framework.app, arguments);
  };
  var reachableGraph = framework.app.analysis.reachableGraph;

  if (reachableGraph) {
    log(2, 'reachableGraph:', reachableGraph);
    framework.files = framework.files.filter(function (file) {
      if (file.analysis && !(file.path in reachableGraph)) {
        log(1, bold(red(file.path)));
      };
      return !file.analysis || file.path in reachableGraph;
    });
    framework.files.filter(function (file) {
      log(1, bold(green(file.path)));
    });
  };

  return callback(framework);
};

Task.prototype.isReadyToRun = function (framework) {
  return framework.app.analysis;
};
