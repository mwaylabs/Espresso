// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      29.10.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var E = require('./e').E,
    Server,
    Proxy = require('./proxy').Proxy;
    App = require('./app').App;



/**
 * @class
 *
 * The server prototype of Espresso build-in development server.
 * This server can hosting the application for the reason  of development.
 * Also handling proxy requests to remote services.
 *
 * The Server has a link to the App, so the server is aware of the application he serves.
 * The Server is holding the application in its memory, so there is no need for the sever
 * to read the files from the files system. The Server can serves as a proxy to test remote service calls.
 * For that reason, the server holds several Proxy objects.
 *
 * @param properties, the properties
 *
 * @extends E
 *
 * @constructor
 */
Server = exports.Server = function(args) {

  /*Properties*/
  this.hostname = '127.0.0.1'; //default address
  this.port = 8000; //default port

  this.proxies = [];
  this.hostedApps = [];   /* = the applications managed by this server */
  //this.files = {};  /* = the files, that should be served by  this server */
  this.files;  /* = the files, that should be served by  this server */

  if(args){
    this.addProperties(this.argv); 
  }

};


/*
 * Getting all basic Espresso functions from the root prototype: M
 */
Server.prototype = new E;

/**
 * @property
 * http to get access to nodes http handling
 */
Server.prototype._e_.http = require('http');

/**
 * @property
 * http to get access to nodes url parsing and handling
 */
Server.prototype._e_.url = require('url');


/**
 * @description
 * Make sure, that the arguments are valid and add the properties.
 * @param {Object} args, the command line arguments
 */
Server.prototype.addProperties = function(args){
 var that = this;
 switch (true) {
      case (args.help || args.h):
        that.printHelp();
        break;
      case (args.version || args.v):
        that.printVersionNumber();
        process.exit(1);      
        break;
      case ((args.port || args.p) && ((typeof args.port === 'string') ||(typeof args.p === 'string'))):
        that.commandLinePort = (args.port) ? args.port : args.p;
        break;
      default:
       break;
 };
};

/**
 * @description
 * Print the usage description of m-server.js
 */
Server.prototype.printHelp = function(){
  console.log(this.style.green("=== m-server.js === "));
  console.log(this.style.green("Espresso "+this.__version__));
  console.log(this.style.green("command line tool to compile and run the application for testing business in a webbrowser"));
  console.log(this.style.green("\n"));
  console.log(this.style.green("--- commands ---"));
  console.log(this.style.green("-p, --port [port]                 specify the port"));
  console.log(this.style.green("-v, --version                     print Espresso version number"));
  console.log(this.style.green("-h, --help                        print this help"));
  console.log(this.style.green("\n"));
  console.log(this.style.green("--- example ---"));
  console.log(this.style.green("./m-server.js --port 6060         start the built-in server on port '6060'"));
  console.log(this.style.green("\n"));
  process.exit(1);
};

/**
 * @description
 * Getting a new App object, and set the Apps server reference to this,
 * so the new app wil be aware of its server.
 * Getting a new App object, passing over the appOptions (if there is any)
 * and let the new app know about its server.
 * @param appOptions, the option/properties for the new App object.
 */
Server.prototype.getNewApp = function(applicationDirectory) {
 var _app = new App(applicationDirectory,this);
 this.hostedApps.push(_app); /* saving the app in local array */
 return _app;
};

/**
 * @description
 * Deliver a file/resource from server cache.
 * @param response, the response, in which the file should be written.
 * @param file, the file to deliver
 */
Server.prototype.deliverThat = function (response,file){
  var _status = 200, // = file found.
      _headers = {};
      // TODO: maybe set the expire-date header ?!
      _headers['Content-Type'] = file.contentType; // get the content type for this resource.
  if(file.isImage()){
    _headers['Content-Length'] = file.content.length;
  }
    
  response.writeHead(_status, _headers);  // write the response header.
  response.write(file.content,'utf8');  // write the content of this resource.
  response.end();
};

/**
 * @description
 * Execute a proxy request. Looking in all attached proxies for a entry, that match
 * the requested resource. If a proxy for the request was found, extract the inquired data
 * from the request and attache them to the proxy request.
 * Also make the actual proxy request, wait for some proxy-response and pass it one to the client
 * via the repsonse object.
 * @param request, the request object.
 * @param response, the response object
 */
Server.prototype.proxyThat = function (request, response){
var that = this;

  request.addListener('end', function() {   
  var _proxy,
      _path = that._e_.url.parse(request.url).pathname.slice(1),
      _pr = _path.split('/')[0];
    //TODO: can this done better ?!
    that.proxies.forEach(function(p){  // looking for proxy entries.
        if(p.proxyAlias === _pr){
          _proxy = p;
        }
    });

   if(_proxy){ // if proxy entry was found.
      var _inquiredData =  request.url.split(_pr)[1];
      that._e_.sys.puts("proxy request on = "+_proxy.host+_inquiredData);
      var proxyClient  =  that._e_.http.createClient(_proxy.hostPort, _proxy.host);

      proxyClient.addListener('error', function(err) {
        console.log('ERROR: "' + err.message + '" for proxy request on ' + _proxy.host + ':' + _proxy.hostPort);
        response.writeHead(404);
        response.end();
      });

      // making the proxy request.
      var proxyRequest =  proxyClient.request(_proxy.requestMethod, _inquiredData,
                                              {'host':  _proxy.host});

      proxyRequest.on('response', function (proxyResponse) {
        console.log('HOST RESPONDING');
        console.log('Status: ' + proxyResponse.statusCode);
        console.log('Content Type: ' + proxyResponse.headers['content-type']);
        response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
        proxyResponse.on('data', function (chunk) {
          response.write(chunk);
        });
        proxyResponse.addListener('end', function() {
          response.end();
        });
      });
      proxyRequest.end();
   }else{ // nor proxy entry found!
     console.log('ERROR: no proxy host entry found for: "'+_pr+'"');
     response.writeHead(404);
     response.end();
   }
 }); 
};

/**
 * @description
 * Add proxies.
 * @param proxies, the proxies that should be used.
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
       that._e_.sys.puts(p.host+' => '+p.proxyAlias);
   });
};


/**
 * @description
 * Run the server, and waiting for requests.
 * @param appName, name of the application.
 */
Server.prototype.run2 = function(appName) {
var that = this,
    _file,_requestedURL,
    _applicationName =  (appName) ? appName : '';

    that._e_.http.createServer(function (request, response) {
        // var path = _e_.url.parse(request.url).pathname.slice(1);
        //  _e_.sys.puts(path);
        _requestedURL = that._e_.url.parse(request.url);
        that._e_.sys.puts('requesting : '+_requestedURL.pathname);

        if((_requestedURL.pathname === '/'+_applicationName)){
            that.files = null;
            that.hostedApps = [];  
            var t = that._e_.path.join(__dirname, '..','..', 'Apps', _applicationName);
            console.log('Build '+t);
            var app = that.getNewApp(t);
     
            app.loadTheApplication();

            app.loadTheMProject();

            app.buildManifestFile = false;
            
            app.build(function (options) {
                app.prepareForServer(function (opt){
                    _file = that.files['/index.html'];
                    that.deliverThat(response,_file);
                })
            });



        }else{
            _file = that.files[(_requestedURL.pathname === '/'+_applicationName) ? '/index.html' : _requestedURL.pathname];
              if (_file === undefined) {
            that.proxyThat(request, response);
           // response.writeHead(200, {'Content-Type': 'text/plain'});
           // response.write('Resource "' + _requestedURL.pathname+ '" not found on server!');
            } else {
                that.deliverThat(response,_file);
            }
        }
      //  console.log(that.files[(_requestedURL.pathname === '/'+_applicationName) ? '/index.html' : _requestedURL.pathname]);

    }).listen(that.port);
    console.log('Server running at http://'+that.hostname+':' + that.port+'/'+_applicationName);
};



/**
 * @description 
 * Run the server, and waiting for requests.
 * @param appName, name of the application.
 */
Server.prototype.run = function(appName) {
var that = this,
    _file,_requestedURL,
    _applicationName =  (appName) ? appName : '';

    that._e_.http.createServer(function (request, response) {
        // var path = _e_.url.parse(request.url).pathname.slice(1);
        //  _e_.sys.puts(path);
        _requestedURL = that._e_.url.parse(request.url);
        that._e_.sys.puts('requesting : '+_requestedURL.pathname);

        _file = that.files[(_requestedURL.pathname === '/'+_applicationName) ? '/index.html' : _requestedURL.pathname];

        if (_file === undefined) {
            that.proxyThat(request, response);
           // response.writeHead(200, {'Content-Type': 'text/plain'});
           // response.write('Resource "' + _requestedURL.pathname+ '" not found on server!');
        } else {
            that.deliverThat(response,_file);
        }          
    }).listen((that.commandLinePort) ? that.commandLinePort : that.port);
    var _thatPort = (that.commandLinePort) ? that.commandLinePort : that.port;
    console.log('Server running at http://'+that.hostname+':' + _thatPort +'/'+_applicationName);
};