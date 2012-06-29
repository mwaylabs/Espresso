#! /usr/bin/env node
// usage: blend-manifest [input-files...] > output-file
// where input-files's content-type ∈ { application/json, application/xml }
// and respective file extension ∈ { .json, .xml }

// implement Object.prototype.merge for mergin JSON objects
Object.defineProperty(Object.prototype, 'merge', {
  enumerable: false,
  value: require('./merge')
})

var XML = require('./XML')
var xotree = new XML.ObjTree();

var pd = require('./pretty-data.js').pd; // for pretty printing xml strings

var readFileSync = require('fs').readFileSync
var extname = require('path').extname
var inspect = require('util').inspect

var parsers = {
  ".xml": function (x) { return xotree.parseXML(x.toString()) },
  ".json": JSON.parse
}

var variables = {
  "${package}": process.env.package,
  "${activity}": process.env.activity
}

function parseFileSync (p) {
  var parse = parsers[extname(p)]
  return JSON.parse(JSON.stringify(parse(readFileSync(p))), function (k, v) {
    return variables.hasOwnProperty(v) ? variables[v] : v
  })
}

function str_obj (x) {
  return inspect(x, false, null)
}

function str_xml (x) {
  return pd.xml(xotree.writeXML(x))
}

var manifest = {}

process.argv.slice(2).forEach(function (p) {
  try {
    var x = parseFileSync(p)
    console.error('merge: ' + p + ' ====>\n' + str_obj(x))
    manifest.merge(x)
  } catch (exn) {
    console.error('merge: ' + p + ' failed')
    console.error(exn.stack)
    process.exit(23)
  }
})

// debug output
console.error('manifest as object:\n' + str_obj(manifest))
console.error('manifest as document:\n' + str_xml(manifest))

console.log(str_xml(manifest))
