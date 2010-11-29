#!/usr/bin/env node

var espresso  = require('../../Espresso/core/espresso').Espresso;

var server = new espresso.Server();

var app = server.getNewApp({

    "name" : "{{appName}}",
    "pathName" : "",
    "buildLanguage" : "en",
    "theme" : "m-deafult",
    "execPath" : __dirname, /*the a actually folder name, in which this files is executed.*/
    "jslintCheck" : true

});

app.loadTheApplication();

app.loadTheMProject();

app.build(function (opt) {
    app.saveLocal(opt);
});
