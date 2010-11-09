// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      29.10.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var Server;
    _l = {},
    App = require('./m_app').App;
 

_l.sys = require('sys');
_l.http = require('http');
_l.url = require('url');


Server = exports.Server = function() {

  this.port = 8000;
  this.hostname = '127.0.0.1';

  this.apps = [];   /* = the applications managed by this server */
  this.files = [];  /* = the files, that should be served by  this server */

};

/**
 * Getting a new App object, and set the Apps server reference to this,
 * so the new app wil be aware of its server.
 *
 * @param appOptions the option/properties for the new App object.
 */
Server.prototype.getNewApp = function(appOptions) {

  app = new App(appOptions); /* getting a new App object, passing over the appOptions (if there is any) */


  app.server = this;   /* let the new App know about its server. */

  this.apps.push(app); /* saving the app in local array */
  return app;
};

/**
 * Start the server!
 * @param app
 */
Server.prototype.run = function() {

    var that = this;

    var app;

    _l.http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});

        var reqURL = _l.url.parse(req.url);
        _l.sys.puts(reqURL.pathname);
        
        that.apps.forEach(function (app){
             if(reqURL.pathname == '/'+app.name){
                    res.write('Espresso Server Responding to: '+ app.name);
                    res.write('<\/br>');
                    res.write('using theme: '+ app.theme);
                    res.write('<\/br>');
                    res.write('using language: ' + app.language);
                    app.build();

                    
             }else{

                   res.write('Application "' + reqURL.pathname+ '" not found on server!');
                  // res.writeHead(404);

             }
        });

          res.end();


    }).listen(that.port, that.hostname);

    _l.sys.puts('Server running at http://127.0.0.1:' + that.port);


};

