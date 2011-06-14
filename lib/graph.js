/*!
 * graph.js
 * 
 * Graph comprehension.
 *
 * Copyright 2011, Panacoda GmbH.  All rights reserved.
 * This file is licensed under the MIT license.
 *
 * @author tv
 */

/*
 * A (directed and acyclic) graph is represented as a JSON object.
 *
 * Example:
 *
 *    G = {
 *      "A": [ "B", "C" ],
 *      "B": [ "D" ],
 *      "D": [], // optional vertex definition without outgoing edges
 *      "C": [ "D" ]
 *    };
 *
 * where the strings are the vertex labels of the graph and the arrays
 * represent the outgoing edges of the respective vertex.
 *
 * The example graph thus has the vertices A, B, C, and D and the
 * edges (A,B), (A,C), (B,D), and (C,D).
 *
 * Note that vertices without outgoing edges don't have to have an entry
 * in the graph object.
 */

/**
 * Compute the reflexive and transitive closure of reachable nodes.
 *
 * @param {Graph} dependency graph
 * @param {String[]} input nodes
 * @returns {String[]} reachable nodes
 */
reach = exports.reach = function (G, xs) {
  var ys = xs.slice();
  var tmp;
  while ((tmp = reach1(G, ys)).length > 0) {
    tmp.forEach(function (y) {
      ys.push(y);
    });
  };
  return ys;
};

/**
 * Compute the set of nodes that is directly reachable from the set of
 * input nodes.  No input node is part of the returned set, even if it
 * has a direct edge to itself.
 *
 * @param {Graph} dependency graph
 * @param {String[]} input nodes
 * @returns {String[]} directly reachable nodes (excluding input nodes)
 */
reach1 = exports.reach1 = function (G, xs) {
  var ys = {};
  var input = {};
  xs.forEach(function (x) {
    input[x] = true;
  });
  xs.forEach(function (x) {
    if (x in G) G[x].forEach(function (y) {
      if (!(y in input)) {
        ys[y] = true;
      };
    });
  });
  return Object.keys(ys);
};


/**
 * Depth-first search based topological sort.
 *
 * @param {Graph}
 * @returns {String[]} topologically sorted list of node names
 */
tsort = exports.tsort = function (G) {
  var L = [];
  var S = Object.keys(G).filter(function (x) {
    return G[x].length === 0; // x has no incoming edges
  });

  var _visited = {};
  function visit(n) {
    if (!(n in _visited)) {
      _visited[n] = true;
      Object.keys(G).forEach(function (m) {
        if (G[m].indexOf(n) >= 0) {
          visit(m);
        };
      });
      L.push(n);
    };
  };

  S.forEach(function (n) { visit(n) });

  return L.reverse();
};

/**
 * Remove all edges from nodes to itself.
 *
 * @param {Graph}
 * @returns {Graph} non-reflexive graph
 */
withoutReflexion = exports.withoutReflexion = function (G) {
  var H = {};
  Object.keys(G).forEach(function (x) {
    H[x] = [];
    G[x].forEach(function (x1) {
      if (x1 !== x) {
        H[x].push(x1);
      };
    });
  });
  return H;
};
