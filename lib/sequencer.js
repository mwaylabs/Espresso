// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      10.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * A simplified version of STEP. To take care of the Task execution sequence.
 *
    STEP:
    Copyright (c) 2010 Tim Caswell <tim@creationix.com>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
 *
 *
 */
exports.sequenceThat = function () {

    /*
       It looks like arguments is an array because it can accessed like an array: (arguments[0], arguments[1], ...),
       but it's NOT A Array(!) Instead the arguments variable is an object.

       To make an array out of it, i used: prototypical inheritance.
       This works by 'hjacking' the Array.splice function to make it work on the arguments object */

  var sequencer = Array.prototype.slice.call(arguments);

    /* Thanks to: Felix Geisendoerfer
       http://debuggable.com/posts/turning-javascripts-arguments-object-into-an-array:4ac50ef8-3bd0-4a2d-8c2e-535ccbdd56cb
     */

  function nextFunction() {
    var currentFunction, returns = [];

    /* test if all functions in the Sequencer has been executed.*/
    if (sequencer.length === 0) {
         if (arguments[0]) {
          throw arguments[0];
      }
        return;
    }else{
      /* Getting the next function to execute, shifting the next element of the array. */
      currentFunction  = sequencer.shift();
    }
    try {
      var returns = currentFunction.apply(this, arguments);

    } catch (exception) {
     /* If a Exception occurs, pass it over to the next function in the sequence */
      nextFunction(exception);
    }

    /* pass over the return value of the current function in the sequence to the next. */
    if (returns !== undefined) {
       nextFunction(undefined, returns);
    }
  }

  /* Start the sequence. */
  nextFunction([]);
}


