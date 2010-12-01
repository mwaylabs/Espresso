// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      30.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var Proxy;



Proxy = exports.Proxy = function(properties) {

   /* Properties */
   this.host = null;
   this.proxy = null; 


  if(properties){
    this.addProperties(properties);
  }

};


Proxy.prototype.addProperties = function(properties){

    var that = this;

    Object.keys(properties).forEach(function (key) {
         that[key] = properties[key];
    });

};


Proxy.prototype.toString = function(){
     return 'Host: '+this.host + '\n'
          +'Proxy: '+this.proxy + '\n';

}