// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      22.02.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


/*
 * test suite for reboard
 */

var Helper = require('./test_helper');

var testObject = {
  a: 1,
  b: 'asdf',
  c: true,
  d: [1,2,3],
  e: { foo: 'bar' }
};

var headers = {
  sessionid: '121212121',
  'x-clienttest1': '2342asadsagfdsa'
};

exports.testPOST = function (test) {
  test.expect(8);

  Helper.post(testObject, headers, function (err, data, resp) {
      if (err) {
        throw err;
      }

      test.ok(data);
      test.ok(resp);
      test.deepEqual(JSON.parse(data.payload), testObject);
      test.strictEqual(resp.headers['content-type'], 'application/json');
      test.strictEqual(resp.headers['x-test1'], 'ASDF1');
      test.strictEqual(resp.headers['x-test2'], 'ASDF2');
      test.strictEqual(data.headers['sessionid'], headers.sessionid);
      test.strictEqual(data.headers['x-clienttest1'], headers['x-clienttest1']);
      test.done();
    });

  setTimeout(function () {
      test.done();
    }, 1000);

};
