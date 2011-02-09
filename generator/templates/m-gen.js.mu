#!/usr/bin/env node

var generator  = require('{{espresso}}/generator/file_generator').FileGenerator;
var argv = require('{{espresso}}/lib/optimist').argv;
var fileGenerator  = new generator();
fileGenerator.gen(argv,__dirname);
