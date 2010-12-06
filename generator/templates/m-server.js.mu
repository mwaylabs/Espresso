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

/* Uncomment the following line, to use m-server as a proxy.
 * Usage:
 * host = the url to your server
 * proxy = the proxy name of your server, used in the application
 * requestMethod = GET / POST
 * hostPort = port of the service on your server - default is '80'
 */

//server.addProxies([
//    { "host":"your.server.com", "proxyAlias": "myServer", "requestMethod": "GET", "hostPort": "80" }
//]);


app.build(function (options) {
    app.prepareForServer(function (opt){
        server.run("{{appName}}");
    })
});



