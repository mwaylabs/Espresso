// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      07.02.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var E = require('./e').E,
    Report;


/**
 * @class
 *
 *
 * @param properties
 *
 * @extends E
 *
 * @constructor
 */
Report = exports.Report = function(properties) {

   /* Properties */


  if(properties){
    this.addProperties(properties);
  }
};


/*
 * Getting all basic Espresso functions from the root prototype: E
 */
Report.prototype = new E();

/**
 * Adds the given properties, to the Report object.
 * @param properties
 */
Report.prototype.addProperties = function(properties){
  var that = this;
  Object.keys(properties).forEach(function (key) {
     that[key] = properties[key];
  });
};
