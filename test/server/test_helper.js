// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      22.02.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


exports.port = 42230;

var URL = 'http://127.0.0.1:8000/echoServer/';
var Http = require('wwwdude');
var Connect = require('connect');

var client = Http.createClient({
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

function _getRequestJSON(request) {
  var req = {
    method: request.method,
    url: request.url,
    headers: request.headers,
    payload: request.rawBody
  };

  return JSON.stringify(req);
}

function echoServer() {
  var port = exports.port;
  //exports.port += 1;

  var server = Connect.createServer(
    Connect.bodyParser(),
    Connect.router(function (app) {
        app.post('/', handler);
      })
  );

  function handler(request, response, next) {
    var payload = _getRequestJSON(request);

    var headers = {
      'content-type': 'application/json',
      'x-test1': 'ASDF1',
      'x-test2': 'ASDF2'
    };

    response.writeHead(200, headers);

    if (request.method !== 'HEAD') {
      response.write(payload);
    }

    response.end();
    server.close();
  }

  server.listen(port, 'localhost');

  return {
    url: 'localhost:' + port,
    serv: server,
    port: port  
  };
}

var echo = echoServer();

var mserver =  require('../../core/server').Server;


var M_Server = new mserver(__dirname);

M_Server.addProxies([
    { "host": "http://localhost",
      "proxyAlias": "echoServer",
      "requestMethod": "POST",
      "hostPort": echo.port
    }
  ]);

/*
 .createProxy({
 log: log,
 url: echo.url
  });  */

/*
 var server = Connect.createServer(
 Connect.gzip(),
 Connect.bodyDecoder(),
 Connect.router(Proxy.route),
 Connect.errorHandler({showStack: true, dumpExceptions: true})
); */


var post = exports.post = function (payload, headers, callback) {
  payload = JSON.stringify(payload);

  M_Server.runDevServer('M_ServerTest'); //(3000, 'localhost');

  client.post(URL, payload, headers)
  .on('error', function (err) {
      callback(err);
    })
  .on('http-server-error', function (data, resp) {
      var parsed = JSON.parse(data);
      callback(new Error(data), parsed, resp);
    })
  .on('forbidden', function (data, resp) {
      var parsed = JSON.parse(data);
      callback('forbidden', parsed, resp);
    })
  .on('success', function (data, resp) {
      var parsed = JSON.parse(data);
      callback(null, parsed, resp);
    })
  .on('complete', function () {
      M_Server.close();
    });
};
