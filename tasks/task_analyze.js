/*!
 * task_analyze.js
 *
 * Copyright 2011, Panacoda GmbH.  All rights reserved.
 * This file is licensed under the MIT license.
 *
 * @author tv
 */

Task = require('./task').Task;
JSLINT = require('../lib/jslint').JSLINT;

Task_Analyze = exports.Task = function () {
  this.name = 'analyze';
};

Task_Analyze.prototype = new Task();

Task_Analyze.prototype.duty = function duty(framework, callback) {
  framework.files.forEach(function (file) {
    if (file.analysis) {
      // TODO proper warning
      console.log('file already analyzed:', file.path);
    } else {
      file.analysis = {
        definitions: { immediate: [], runtime: [] },
        references: { immediate: [], runtime: [] }
      };

      var result = JSLINT(file.content.toString());

      console.log('JSLINT result:', result);

      var T = deep_copy(JSLINT.tree);

      (function (tmp, tree) {
        tree = deep_copy(T);

        // Collect all definitions and references.
        tmp = collect_definitions_and_references(tree);
        Object.keys(tmp.definitions).forEach(function (x) {
          file.analysis.definitions.runtime.push(x);
        });
        Object.keys(tmp.references).forEach(function (x) {
          file.analysis.references.runtime.push(x);
        });

        // Collect only immediate definitions and references,
        // i.e. anything, that's not inside a (non-applied) function.
        // Note that immediates are a subset of runtimes.
        //  XXX could/should we analyze for immediate-onlys?
        prune_functions(tree);
        tmp = collect_definitions_and_references(tree);
        Object.keys(tmp.definitions).forEach(function (x) {
          file.analysis.definitions.immediate.push(x);
        });
        Object.keys(tmp.references).forEach(function (x) {
          file.analysis.references.immediate.push(x);
        });
      })();

      // dump
      console.log('[35;1m^L[m');
      console.log(file.path, '=')
      console.log(require('sys').inspect({
        tree: T,
        analysis: file.analysis,
        path: file.path
      }, false, 100));
    };
  });

  callback(framework);
};

// Library for Task_Analyze

The_relevant_parts = [
  'value',  'arity', 'name',  'first',
  'second', 'third', 'block', 'else'
];

function deep_copy(T) {
  return JSON.parse(JSON.stringify(T, The_relevant_parts));
};

function prune_functions(T) {
  walk(T,
    function (T) { return T.value === 'function' },
    function (T) {
      var value = T.value;
      var name = T.name;
      prune(T);
      T.value = '<pruned:' + value + (name ? ':' + name : '') + '>';
    });
};

function collect_definitions_and_references(T) {
  T = deep_copy(T);
  walk(T,
      function (T) { return T.value === '.' },
      function (T) {
        var ref = dot(T);
        prune(T);
        T.value = '<ref>';
        T.first = ref;
      });
  walk(T,
      function (T) {
        return 'value' in T && !('arity' in T) && /^\w+$/.test(T.value);
      },
      function (T) {
        var ref = [T.value];
        prune(T);
        T.value = '<ref>';
        T.first = ref;
      });
  walk(T,
      function (T) { return T.value === '=' },
      function (T) {
        if (T.first.value === '<ref>') {
          var def = T.first.first;
          var second = T.second;
          prune(T);
          T.value = '<def>';
          T.first = def;
          T.second = second;
        };
      });
  var defs = {};
  var refs = {};
  walk(T,
      function (T) { return T.value === '<def>' },
      function (T) {
        defs[T.first.join('.')] = T.first;
      });
  walk(T,
      function (T) { return T.value === '<ref>' },
      function (T) {
        refs[T.first.join('.')] = T.first;
      });

  return { definitions: defs, references: refs };
};

function prune(T) {
  Object.keys(T).forEach(function (k) {
    delete T[k];
  });
};

function walk(T, p, f) {
  (function _walk(T) {
    if (typeof T === 'object') {
      if (T instanceof Array) {
        T.forEach(_walk);
      } if (p(T)) {
        f(T);
      } else {
        The_relevant_parts.forEach(function (k) {
          _walk(T[k]);
        });
      };
    };
  })(T);
};

function dot(T) {
  if (T.value === '.') {
    var y = [];
    dot(T.first ).forEach(function (x) { y.push(x) });
    dot(T.second).forEach(function (x) { y.push(x) });
    return y;
  } else {
    return [T.value];
  };
};
