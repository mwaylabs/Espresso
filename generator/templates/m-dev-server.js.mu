#!/usr/bin/env node

var espresso  = require('{{espresso}}/core/espresso').Espresso;

var server = new espresso.Server(__dirname);

server.runDevServer("{{appName}}");

