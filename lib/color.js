// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      10.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/* This file is a implementation of colored.js:

   Copyright (c) 2009 Chris Lloyd.

   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'),
   to deal in the Software without restriction, including without limitation the rights to use,
   copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
   and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
   IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
   WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function(){

  var colors = {
        black: 30,
        red: 31,
        green: 32,
        yellow: 33,
        blue: 34,
        magenta: 35,
        cyan: 36,
        white: 37
      },
      extras = {
        reset: 0,
        bold: 1,
        underline: 4,
        reversed: 7
      };

  function esc(str) {
    return "\x1B["+str+'m';
  }

  function defineColoredFn(name, code) {
    if(process && process.isTTY && !process.isTTY()) {
      exports[name] = function(str) {
        return (str || this)
      }
    } else {
      exports[name] = function(str) {
        return esc(code) + (str || this) + esc(extras.reset);
      }
    }
  }

  for(var name in colors) {
    defineColoredFn(name, colors[name]);
  };

  for(var name in extras) {
    defineColoredFn(name, extras[name])
  };

})();