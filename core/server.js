// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      29.10.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var Http = require('http');
var Url = require('url');
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
var Server = exports.Server = function (options) {
  /*Properties*/
  this.hostname = '127.0.0.1'; //default address
  this.port = options.port;

  if (options.directory === "$PWD") {
   this.projectDirName = process.cwd() + '/';
  } else {
   this.projectDirName = options.directory + '/';
  }

  this.manifestMode = options.manifest;
  this.proxies = [];
  this.hostedApps = [];   /* = the applications managed by this server */
  this.files = [];  /* = the files, that should be served by  this server */
};


/*
 * Getting all basic Espresso functions from the root prototype: M
 */
Server.prototype = new E();

/*
 * Run development server
 */
Server.prototype.run = function () {
  if (this.manifestMode) {
    this.runManifestServer();
  } else {
    this.runDevServer();
  }
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
      var _path = Url.parse(request.url).pathname.slice(1);
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

      function _respond404(err) {
        response.writeHead(404);
        response.end(err);
      }

      //TODO: can this done better ?!
      that.proxies.forEach(function (p) {  // looking for proxy entries.
          if (p.proxyAlias === _pr) {
            _proxy = p;
          }
        });

      if (_proxy) { // if proxy entry was found.
        var _inquiredData = request.url.replace(new RegExp('^/' + _pr), '');
        var url = _proxy.baseUrl + _inquiredData;
        var method = request.method.toLowerCase();

        that._e_.sys.puts("proxy request to " + url);
        var proxyClient  = wwwdude.createClient({ gzip: false });
        var proxyRequest;

        // clean headers
        delete request.headers['accept-encoding'];
        delete request.headers['connection'];
        delete request.headers['content-length'];
        delete request.headers['if-none-match'];
        delete request.headers['host'];

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
        .on('redirect', function (data, resp) {
            console.log('Redirecting to: ' + resp.headers['location']);
          })
        .on('success', function (data, resp) {
            _respondRequestSuccess(data, resp);
          })
        .on('complete', function (data, resp) {
            console.log('Finished request to: ' + url);
          });
      } else {
        var proxyError = 'No proxy found for: ' + _pr;
        _respond404(proxyError);
        console.log(proxyError);
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
  var port = this.port;

  this.appServer = Http.createServer(function (request, response) {
      var _file;
      var _requestedURL = Url.parse(request.url);

      if ((_requestedURL.pathname === '/' + appName) || (_requestedURL.pathname === '/' + appName + '/')) {
        response.writeHead(301, Location: '/' + appName + '/' + 'index.html');
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
  var that = this;
  var port = this.port;
  var _file, _requestedURL;

  appName = appName || this.app.name;

  function startServer() {
    this.appServer = Http.createServer(function (request, response) {
        _requestedURL = Url.parse(request.url);
        Util.puts('requesting : ' + _requestedURL.pathname);

        if (_requestedURL.pathname === '/' + appName) { // requested app
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
