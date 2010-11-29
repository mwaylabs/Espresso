// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      29.10.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/*
 * The server prototype.
 */

var Server;
    _l = {},
    App = require('./app').App;
 

_l.sys = require('sys');
_l.http = require('http');
_l.url = require('url');


Server = exports.Server = function() {

  this.port = 8000;
  this.hostname = '127.0.0.1';

  this.apps = [];   /* = the applications managed by this server */
  this.files = {};  /* = the files, that should be served by  this server */

};

/**
 * Getting a new App object, and set the Apps server reference to this,
 * so the new app wil be aware of its server.
 *
 * @param appOptions the option/properties for the new App object.
 */
Server.prototype.getNewApp = function(appOptions) {

  app = new App(appOptions); /* getting a new App object, passing over the appOptions (if there is any) */

  app.server = this;   /* let the new app know about its server. */

  this.apps.push(app); /* saving the app in local array */
  return app;
};

/**
 * Start the server!
 * @param app
 */
Server.prototype.run = function(appName) {

    var that = this;

    if(appName){
        // options could be some additional config information.
        //TODO: do something with the options.
    }

    var app;

    _l.http.createServer(function (req, res) {
        //res.writeHead(200, {'Content-Type': 'text/html'});

        var reqURL = _l.url.parse(req.url);
        _l.sys.puts(reqURL.pathname);

        file = that.files[reqURL.pathname];

        if (file === undefined) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('Application "' + reqURL.pathname+ '" not found on server!');
        } else {

            var status = 200;

             var headers = [];
                 headers['Content-Type'] = file.contentType;
                // headers['Last-Modified'] = res.lastModified.format('httpDateTime');
             _l.sys.puts('file.contentType '  +file.contentType);

             res.writeHead(status, headers);

             res.write(file.content);


        }
          res.end();


    }).listen(that.port, that.hostname);

    _l.sys.puts('Server running at http://127.0.0.1:' + that.port+'/'+appName);


};

