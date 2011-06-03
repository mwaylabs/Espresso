/*!
 * task_cacheFiles.js
 *
 * Copyright 2011, Panacoda GmbH.  All rights reserved.
 * This file is licensed under the MIT license.
 *
 * @author tv
 */

var Task = require('./task').Task;

/**
 * @class
 * Move files from framework to the global state.
 * This is used by task_mergeApp.js to generate the final app.
 *
 * @extends Task
 */
var Task_CacheFiles = exports.Task = function () {
  this.name = 'cacheFiles';
};

Task_CacheFiles.prototype = new Task();

Task_CacheFiles.prototype.duty = function duty(framework, callback) {
  if (!framework.globalState.files) {
    framework.globalState.files = {};
  };
  framework.files.forEach(function (file) {
    framework.globalState.files[file.path] = file;
  });
  framework.files = [];
  callback(framework);
};
