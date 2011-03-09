// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      29.10.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var E = require('./e').E;
var Proxy = require('./proxy').Proxy;
var App = require('./app').App;
var wwwdude = require('../lib/wwwdude');

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
var Server = exports.Server = function (dirname) {

  /*Properties*/
  this.hostname = '127.0.0.1'; //default address
  this.port = 8000; //default port

  this.projectDirName = dirname;

  this._DEVMODE_ = 1;
  this._MANIFESTMODE_ = 0;

  this.runMode = this._DEVMODE_;

  this.proxies = [];
  this.hostedApps = [];   /* = the applications managed by this server */
  //this.files = {};  /* = the files, that should be served by  this server */
  this.files = [];  /* = the files, that should be served by  this server */

  if (this.argv.$0 !== 'node ./m-build.js') {
    this.addProperties(this.argv);
  }

};


/*
 * Getting all basic Espresso functions from the root prototype: M
 */
Server.prototype = new E();


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
Server.prototype.addProperties = function (args) {
  var that = this;

  switch (true) {
  case (args.help || args.h):
    that.printHelp();
    break;
  case (args.version || args.v):
    that.printVersionNumber();
    process.exit(1);
    break;
  case ((args.manifest || args.m)):
    that.runMode  = that._MANIFESTMODE_;
    break;
  default:
    that.runMode  = that._DEVMODE_;
    break;
  }
};


Server.prototype.run = function (appname) {
  var that = this;
  var args = that.argv;

  if ((args.port || args.p) && ((typeof args.port === 'string') || (typeof args.p === 'string'))) {
    that.commandLinePort = (args.port) ? args.port : args.p;
  }

  switch (that.runMode) {
  case that._DEVMODE_:
    that.runDevServer(appname);
    break;
  case that._MANIFESTMODE_:
    that.runManifestServer(appname);
    break;
  default:
    that.runDevServer(appname);
    break;

  }
};

/**
 * @description
 * Print the usage description of m-server.js
 */
Server.prototype.printHelp = function () {
  console.log(this.style.green("=== m-server.js === "));
  console.log(this.style.green("Espresso v" + this.__version__));
  console.log(this.style.green("command line tool to compile and run the application for testing business in a webbrowser"));
  console.log(this.style.green("\n"));
  console.log(this.style.green("--- commands ---"));
  console.log(this.style.green("-m, --manifest                    start the server in manifest mode. Enable generation of cache.menifest."));
  console.log(this.style.green("-p, --port [port]                 specify a custom port."));
  console.log(this.style.green("-v, --version                     print Espresso version number."));
  console.log(this.style.green("-h, --help                        print this help."));
  console.log(this.style.green("\n"));
  console.log(this.style.green("--- example usage---"));
  console.log(this.style.green("./m-server.js                     start the server. (Default)"));
  console.log(this.style.green("./m-server.js --port 6060         start the server on port '6060'."));
  console.log(this.style.green("./m-server.js -m -p 1234          start the server in manifest mode on port '1234'."));
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
Server.prototype.getNewApp = function (applicationDirectory) {
  var  _app  = new App(applicationDirectory, this);
  // var _app = new App(applicationDirectory,this);
  this.hostedApps.push(_app); /* saving the app in local array */
  return _app;
};

/**
 * @description
 * Deliver a file/resource from server cache.
 * @param response, the response, in which the file should be written.
 * @param file, the file to deliver
 */
Server.prototype.deliverThat = function (response, file) {
  var _status = 200, // = file found.
  _headers = {};
  // TODO: maybe set the expire-date header ?!
  _headers['Content-Type'] = file.contentType; // get the content type for this resource.
  if (file.isImage()) {
    _headers['Content-Length'] = file.content.length;
  }

  response.writeHead(_status, _headers);  // write the response header.
  response.write(file.content, 'utf8');  // write the content of this resource.
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
Server.prototype.proxyThat = function (request, response) {
  var that = this;
  var _requestMethod  = request.method;
  var body = '';

  request.on('data', function (chunk) {
      body += chunk;
      console.log('chunk  = ' + chunk);
    });

  request.on('end', function () {
      var _path = that._e_.url.parse(request.url).pathname.slice(1);
      var _pr = _path.split('/')[0];
      var _proxy;

      function _respondNetError(err) {
        response.writeHead(500);
        response.end(err.toString());
      }

      function _respondRequestSuccess(data, resp) {
        response.writeHead(200, resp.headers);
        response.end(data);
      }

      function _respondRequestError(err, resp) {
        response.writeHead(500);
        response.end(err);
      }

      //TODO: can this done better ?!
      that.proxies.forEach(function (p) {  // looking for proxy entries.
          if (p.proxyAlias === _pr) {
            _proxy = p;
          }
        });

      if (_proxy) { // if proxy entry was found.
        var _inquiredData = request.url.split(_pr)[1];
        var url = _proxy.baseUrl + _inquiredData;
        var method = request.method.toLowerCase();

        that._e_.sys.puts("proxy request to " + url);
        var proxyClient  = wwwdude.createClient({ gzip: false });
        var proxyRequest;

        // clean gzip header field
        delete request.headers['accept-encoding'];

        if (method === 'post' || method === 'put') {
          proxyRequest = proxyClient[method](url, body, request.headers);
        } else {
          proxyRequest = proxyClient[method](url, request.headers);
        }

        proxyRequest.on('error', function (err) {
            _respondNetError(err);
          })
        .on('http-error', function (err, resp) {
            _respondRequestError(err, resp);
          })
        .on('success', function (data, resp) {
            _respondRequestSuccess(data, resp);
          })
        .on('complete', function (data, resp) {
            console.log('Finished request to: ' + url);
          });
      } else {
        console.log('No proxy found for: ' + _pr);
      }

    });
};

/**
 * @description
 * Add proxies.
 * @param proxies, the proxies that should be used.
 */
Server.prototype.addProxies = function (proxies) {
  var that = this;

  if (proxies && Array.isArray(proxies)) {
    proxies.forEach(function (proxy) {
        if (!(proxy instanceof Proxy)) {
          that.proxies.push(new Proxy(proxy));
        }
      });
  }
  that.proxies.forEach(function (p) {
      that._e_.sys.puts(p.host + ' => ' + p.proxyAlias);
    });
};


/**
 * @description
 * Mapping of the user agent strings, to resource targets.
 * @param osFamily {string}, the os system of the device.
 * @return {object} - the targetQuery object.
 */
Server.prototype.resolveUAMapping = function (osFamily) {
  //console.log(osFamily);

  switch (osFamily) {
  case ("iOS"):
    return {"vendor" : "apple"};
  case ("Linux"):
    return {"vendor" : "android"};
  default:
    return {};

  }
};

Server.prototype.close = function () {
  this.appServer.close();
};


/**
 * @description
 * Run the server, and wait for requests.
 * @param appName, name of the application.
 */
Server.prototype.runDevServer = function (appName) {
  var that = this;
  var data = '';

  port = that.commandLinePort || that.port;
  appName = appName || '';

  this.appServer = that._e_.http.createServer(function (request, response) {
      var _file;
      var _requestedURL = that._e_.url.parse(request.url);

      if ((_requestedURL.pathname === '/' + appName) || (_requestedURL.pathname === '/' + appName + '/')) {
        var _headers = {};
        _headers.Location = '/' + appName + '/' + 'index.html';
        response.writeHead(301, _headers);
        response.end();
      } else if ((_requestedURL.pathname === '/' + appName + '/' + 'index.html')  ) {
        that.files = {};
        that.hostedApps = [];
        var app = that.getNewApp(that.projectDirName);
        app.offlineManifest = false;

        app.loadTheApplication();
        app.loadTheMProject();

        app.build(function (options) {
            app.prepareForServer(function (opt) {
                _file = that.files['/' + appName + '/index.html'];
                that.deliverThat(response, _file);
              });
          });

      } else {
        console.log(_requestedURL.pathname);
        _file = that.files[_requestedURL.pathname];
        if (!_file) {
          that.proxyThat(request, response);
        } else {
          that.deliverThat(response, _file);
        }

      }

    });

  this.appServer.listen(port, function () {
      console.log('Server running at http://' + that.hostname + ':' + port + '/' + appName);
    });
};



/**
 * @description
 * Run the server, and waiting for requests.
 * @param appName, name of the application.
 */
Server.prototype.runManifestServer = function (appName) {
  var that = this,
  _file, _requestedURL,
  port = that.commandLinePort || that.port;

  appName = appName || this.app.name;

  function startServer() {
    this.appServer =   that._e_.http.createServer(function (request, response) {
        _requestedURL = that._e_.url.parse(request.url);
        that._e_.sys.puts('requesting : ' + _requestedURL.pathname);

        if ((_requestedURL.pathname === '/' + appName)) { // requested app
          response.writeHead(301, { Location: '/' + appName + '/' + 'index.html' });
          response.end();
        } else {
          _file = that.files[(_requestedURL.pathname === '/' + appName) ? '/index.html' : _requestedURL.pathname];
          if (!_file) { // -> proxy request
            that.proxyThat(request, response);
          } else {
            that.deliverThat(response, _file);
          }

        }

      });

    this.appServer.listen(port, function() {
        console.log('Server running at http://' + that.hostname + ':' + port + '/' + appName);
      });
  }

  var app = that.getNewApp(that.projectDirName);

  app.loadTheApplication();
  app.loadTheMProject();

  app.build(function (options) {
      app.prepareForServer(function (opt) {
          startServer();
        });
    });

};
