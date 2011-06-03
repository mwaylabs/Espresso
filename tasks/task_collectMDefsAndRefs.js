/*!
 * task_collectMDefsAndRefs.js
 *
 * Copyright 2011, Panacoda GmbH.  All rights reserved.
 * This file is licensed under the MIT license.
 *
 * @author tv
 */

var Task = require('./task').Task;

/**
 * @class
 * Add definitions and references of M-Project objects to the global state.
 * This is used by Task_MergeApp to compute the dependency graph.
 *
 * @extends Task
 */
Task_collectMDefsAndRefs = exports.Task = function () {
  this.name = 'collectMDefsAndRefs';
};

Task_collectMDefsAndRefs.prototype = new Task();

Task_collectMDefsAndRefs.prototype.duty = function(framework, cb) {
  var that = this;

  // definitions map file paths to object names, that are defined in the
  // respective file.
  if (!framework.globalState.definitions) {
    framework.globalState.definitions = {};
  };
  var _defs = framework.globalState.definitions;

  // references map object names to file paths, that are 
  if (!framework.globalState.references) {
    framework.globalState.references = {};
  };
  var _refs = framework.globalState.references;

  this.sequencer(
    function () {
      framework.files.forEach(function(file) {
          if (file.isJavaScript()) {
            var _re, _match;
            var _path = file.path;
            var _deps = [];
            var _content = stripComments(file.content.toString());

            // collect object references
            _re = /(\bM\.(\w+)\b)\s*[^=]/g
            while (_match = _re.exec(_content)) {
              var _name = _match[1];
              if (!(_path in _refs)) {
                _refs[_path] = [];
              }
              _refs[_path].push(_name);
            }

            // collect object definitions
            _re = /(\bM\.(\w+)\b)\s*=/g
            while (_match = _re.exec(_content)) {
              var _name = _match[1];
              if (!(_name in _defs)) {
                _defs[_name] = _path;
              } else {
                console.log('[31mYou are made of stupid![m');
                throw new Error(
                    _name + ' is already defined in '
                    + _defs[_name]
                    + '\n' + _path + ' failed!'
                );
              };
            };
          };
      });
      return framework;
    },
    function (err, fr) {
      cb(fr);
    }
  );
};

// TODO does this warrant a new lib/-file?
/**
 * Strip comments.
 *
 * Note that we're also stripping comments from strings, but as that doesn't
 * affect this task we're igoring it.
 *
 * @param{String}
 */
function stripComments (x) {
  return (x
      .replace(/\/\/.*(?:[\r\n]|$)/gm, '')
      .replace(/\/\*(?:[^*]|\*[^\/])*\*\//gm, '')
  );
};
