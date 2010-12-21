// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      30.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var E = require('./e').E,
    Proxy;


/**
 * @class
 *
 * Prototype for a proxy object.
 * Every Proxy object belongs to one Server. A Proxy object contains all information about a proxy entry.
 *
 * @param properties
 *
 * @extends E
 *
 * @constructor
 */
Proxy = exports.Proxy = function(properties) {

   /* Properties */
  this.host = null;
  this.hostPort = '80';
  this.proxyAlias = null;
  this.requestMethod = null;

  if(properties){
    this.addProperties(properties);
  }
};


/*
 * Getting all basic Espresso functions from the root prototype: M
 */
Proxy.prototype = new E;

/**
 * Adds the given properties, to the proxy object.
 * @param properties
 */
Proxy.prototype.addProperties = function(properties){
  var that = this;
  Object.keys(properties).forEach(function (key) {
     that[key] = properties[key];
  });
};

/**
 * @description
 * Override Object.toString()
 * @exampleText
 * Host: www.yourService.com
 * Proxy: your_service
 * @return {string} a readable presentations of this proxy object.
 */
Proxy.prototype.toString = function(){
 return 'Host: '+this.host + '\n'
       +'Proxy: '+this.proxyAlias + '\n';
};