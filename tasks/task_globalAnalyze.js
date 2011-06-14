/*!
 * task_globalAnalyze.js
 *
 * Copyright 2011, Panacoda GmbH.  All rights reserved.
 * This file is licensed under the MIT license.
 *
 * @author tv
 */

Graph = require('../lib/graph');

/**
 * @class
 * Analyze framework files and put the results into the analysis-property.
 *
 * @extends Task
 */
Task = exports.Task = function () {
  this.name = 'globalAnalyze';
};

Task.prototype = new (require('./task').Task)();

Task.prototype.duty = function (framework, callback) {
  var red = this.style.red;
  var log = function () {
    framework.app.log.apply(framework.app, arguments);
  };
  var analysis = {};

  // reachable : path[]
  var reachable =
      framework.app.reachable instanceof Array ? framework.app.reachable : [];

  // files : { path -> file }
  var files = {};
  framework.app.frameworks.forEach(function (framework) {
    framework.files.forEach(function (file) {
      if (file.analysis) {
        files[file.path] = file;
      };
    });
  });
  log(2, 'Object.keys(files).length:', Object.keys(files).length);
  log(2, 'Object.keys(files):', Object.keys(files));
  

  // definitions : { name -> path }
  var definitions = {};
  Object.keys(files).forEach(function (path) {
    files[path].analysis.definitions.forEach(function (definition) {
      // TODO check collisions?
      definitions[definition] = path;
    });
  });
  log(2, 'Object.keys(definitions).length:', Object.keys(definitions).length);
  log(2, 'Object.keys(definitions):', Object.keys(definitions));
  log(2, 'definitions:', definitions);
  

  // filter predicates
  var relevant_re =
      new RegExp('^(?:m_require|M|' + framework.app.name + ')(?:\\.[^.]+)*$');
  function is_relevant(x) {
    return relevant_re.test(x) || reachable.indexOf(x) >= 0;
  };

  function is_top_or_second_level(name) {
    return name.replace(/[^.]/g, '').length <= 1; // only X and X.y
  };

  function is_Mproject_IDE_hack(name) {
    // fix for the cyclic definition: var app = app || {};
    return name !== framework.app.name;
  };

  var warn_path = undefined;
  function is_defined(name) {
    if (!(name in definitions)) {
      log(2, red(warn_path + ': undefined reference: ' + name));
    } else if (!definitions[name]) {
      log(2, red(warn_path + ': bad definition: ' + name));
    } else {
      return name in definitions;
    };
  };

  function name_to_path(name) {
    return definitions[name];
  };

  // dependency_graph : { path -> path }
  var dependency_graph = {};
  Object.keys(files).forEach(function (path) {
    warn_path = path;
    dependency_graph[path] = {};

    // all references
    files[path].analysis.references.forEach(function (name) {
      all_parts(name, true)
          .filter(is_top_or_second_level)
          .filter(is_relevant)
          .filter(is_Mproject_IDE_hack)
          .filter(is_defined)
          .map(name_to_path)
          .forEach(function (def_path) {
            dependency_graph[path][def_path] = true;
          });
    });

    // for all property definitions X.y : reference X
    files[path].analysis.definitions.forEach(function (name) {
      all_parts(name, false)
          .filter(is_top_or_second_level)
          .filter(is_relevant)
          .filter(is_Mproject_IDE_hack)
          .filter(is_defined)
          .map(name_to_path)
          .forEach(function (def_path) {
            dependency_graph[path][def_path] = true;
          });
    });

    dependency_graph[path] = Object.keys(dependency_graph[path]);
  });
  log(2, 'Object.keys(dependency_graph).length:', Object.keys(dependency_graph).length);
  log(2, 'dependency_graph:', dependency_graph);
  

  // root_paths : path[]
  var root_paths = framework.files
      .filter(function (file) {
        return file.analysis;
      })
      .map(function (file) {
        return file.path
      });
  reachable
      .filter(is_top_or_second_level)
      .filter(is_relevant)
      .filter(is_Mproject_IDE_hack)
      .filter(is_defined)
      .map(name_to_path)
      .forEach(function (path) {
        if (root_paths.indexOf(path) < 0) {
          log(3, 'reachable by config:', path);
          root_paths.push(path);
        };
      });
  log(2, 'root_paths:', root_paths);
  

  // reachable_paths : path[]
  var reachable_paths = Graph.reach(dependency_graph, root_paths);
  log(2, 'reachable_paths.length:', reachable_paths.length);
  log(2, 'reachable_paths:', reachable_paths);
  
  
  // reachable_graph : { path -> path }
  var reachable_graph = {};
  reachable_paths.forEach(function (path) {
    reachable_graph[path] = dependency_graph[path];
  });
  reachable_graph = Graph.withoutReflexion(reachable_graph);
  log(2, 'reachable_graph:', reachable_graph);
  analysis.reachableGraph = reachable_graph;
  

  framework.app.analysis = analysis;
  log(1, 'globally analyzed', framework.name);

  return callback(framework);
};

/**
 * This task is ready to run when the number of analyzed frameworks is equal to
 * the number of frameworks to be analyzed.  That is, all frameworks that have
 * the analyze task in their task chain are required to finish the analyze task
 * before this task is ready to run.
 */
Task.prototype.isReadyToRun = function (framework) {

  var frameworks_to_analyze = 0;
  framework.app.frameworks.forEach(function (framework) {
    for (var task = framework.taskChain; task; task = task.next) {
      if (task.name === 'analyze') {
        frameworks_to_analyze++;
        break;
      };
    };
  });

  var analyzed_frameworks =
      framework.app.frameworks.filter(function (framework) {
        return framework.analysis;
      }).length;

  return analyzed_frameworks === frameworks_to_analyze;
};


// X.foo.bar.baz -> X, X.foo, X.foo.bar [, X.foo.bar.baz]
function all_parts(x, reflexive) {
  var parents = [];
  var match = /^([^.]+(?:\.[^.]+)*)$/.exec(x);
  if (match) {
    var parts = match[1].split('.');
    for (var i = 1, n = parts.length + (reflexive ? 1 : 0); i < n; ++i) {
      parents.push(parts.slice(0, i).join('.'));
    };
  };
  return parents;
};

