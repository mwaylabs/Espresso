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
    Proxy = require('./proxy').Proxy;
    App = require('./app').App;
 

_l.sys = require('sys');
_l.fs = require('fs');
_l.http = require('http');
_l.url = require('url');


Server = exports.Server = function() {

  /*Properties*/
  this.hostname = '127.0.0.1'; //default address
  this.port = 8000; //default port

  this.proxies = [];
  this.hostedApps = [];   /* = the applications managed by this server */
  this.files = {};  /* = the files, that should be served by  this server */

};

/**
 * Getting a new App object, and set the Apps server reference to this,
 * so the new app wil be aware of its server.
 *
 * @param appOptions the option/properties for the new App object.
 */
Server.prototype.getNewApp = function(appOptions) {

 var _app = new App(appOptions); /* getting a new App object, passing over the appOptions (if there is any) */
     _app.server = this;   /* let the new app know about its server. */
 this.hostedApps.push(_app); /* saving the app in local array */

 return _app;
};

/**
 * Deliver a file/resource.
 *
 * @param response, the response, in which the file should be written.
 * @param file, the file to deliver
 */
Server.prototype.deliver = function (response,file){

  var status = 200; // = file found.

  var headers = {};
      headers['Content-Type'] = file.contentType; // get the content type for this resource.
      //headers['Last-Modified'] = res.lastModified.format('httpDateTime');
     //_l.sys.puts('file.contentType =  '  +file.contentType);

     if(file.isImage()){
       headers['Content-Length'] = file.content.length;

     }
     response.writeHead(status, headers);  // write the response header.
     response.write(file.content,'utf8');  // write the content of this resource.
     response.end();

};


Server.prototype.proxy = function (request, response){

var that = this;

  request.addListener('end', function() {   
  var proxyHost
  var path = _l.url.parse(request.url).pathname.slice(1);
  var pr=  path.split('/')[0];
  var data =  request.url.split(pr)[1];

 // _l.sys.puts("data = "+data);

    that.proxies.forEach(function(p){
        if(p.proxy === pr){
          proxyHost = p.host;
        }

   });

   _l.sys.puts("proxyHost = "+proxyHost);

  var proxyClient  =  _l.http.createClient(80, proxyHost);
  var proxyRequest =  proxyClient.request('GET', data,
  {'host': proxyHost});




 proxyRequest.on('response', function (proxyResponse) {
  console.log('STATUS: ' + proxyResponse.statusCode);
  console.log('HEADERS: ' + JSON.stringify(proxyResponse.headers));
  response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
 // response.setEncoding('utf8');
  proxyResponse.on('data', function (chunk) {
      response.write(chunk);
  });

      proxyResponse.addListener('end', function() {
          response.end();
        });   
});
 proxyRequest.end();
});


};

/**
 * Add proxy entries.
 * @param proxies, the proxies, that should be used
 */
Server.prototype.addProxies = function(proxies){
var that = this;

  if(proxies && Array.isArray(proxies)){
      proxies.forEach(function(proxy){
        if (!(proxy instanceof Proxy)) {
           that.proxies.push(new Proxy(proxy));
        }
      });
  }
   that.proxies.forEach(function(p){
       _l.sys.puts(p.host+' -> '+p.proxy);
   });

};

/**
 * Run the server!
 * @param appName, name of the application.
 */
Server.prototype.run = function(appName) {

    var that = this;
    var _file,_requestedURL,_applicationName = ' ';

    if(appName){
       _applicationName = appName;
    }
     //      console.log(require('util').inspect(that.files, true, 1));
    _l.http.createServer(function (request, response) {
         var path = _l.url.parse(request.url).pathname.slice(1);
         //  _l.sys.puts(path);

        _requestedURL = _l.url.parse(request.url);
        _l.sys.puts(_requestedURL.pathname);
        _file = that.files[_requestedURL.pathname];

        if (_file === undefined) {
            that.proxy(request, response);
           // response.writeHead(200, {'Content-Type': 'text/plain'});
           // response.write('Resource "' + _requestedURL.pathname+ '" not found on server!');
        } else {
            that.deliver(response,_file);
        }          
    }).listen(that.port, that.hostname);

    _l.sys.puts('Server running at http://'+that.hostname+':' + that.port+'/'+_applicationName);


};

