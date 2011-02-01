#!/usr/bin/env node

var espresso  = require('../../Espresso/core/espresso').Espresso;

var server = new espresso.Server(false);

var app = server.getNewApp(__dirname);

app.loadTheApplication();

app.loadTheMProject();

app.build(function (options) {
    app.saveLocal(options);
});