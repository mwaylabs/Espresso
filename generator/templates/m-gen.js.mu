#!/usr/bin/env node

var generator  = require('../../Espresso/generator/file_generator').FileGenerator;
var argv = require('../../Espresso/lib/optimist').argv;
var fileGenerator  = new generator();
fileGenerator.gen(argv,__dirname);
