/*
	node-logger library
	http://github.com/igo/node-logger

	Copyright (c) 2010 by Igor Urmincek

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

var sys = require('sys');


function padZero(number) {
	var n = String(number);
	if (number < 10) {
		return '0' + n;
	} else {
		return n;
	}
}

function pad2Zeros(number) {
	var n = String(number);
	if (number < 10) {
		return '00' + n;
	} else if (number < 100) {
		return '0' + n;
	} else {
		return n;
	}
}

function getDate() {
	var now = new Date();
	return now.getFullYear() + '-' + padZero(now.getMonth()) + '-' + padZero(now.getDate()) + ' ' +
		padZero(now.getHours()) + ':' + padZero(now.getMinutes()) + ':' + padZero(now.getSeconds()) + '.' + pad2Zeros(now.getMilliseconds());
}

function getLine(module) {
	try {
		throw new Error();
	} catch(e) {
		// now magic will happen: get line number from callstack
		var line = e.stack.split('\n')[3].split(':')[1];
		return line;
	}
}

function getClass(module) {
	if (module) {
		if (module.id) {
			if (module.id == '.') {
				return 'main';
			} else {
				return module.id;
			}
		} else {
			return module;
		}
	} else {
		return '<unknown>';
	}
}

function getMessage(msg) {
	if (typeof msg == 'string') {
		return msg;
	} else {
		return sys.inspect(msg, false, 10);
	}
}

exports.logger = function(module, useColor) {
	var useColor = useColor || false;
	var methods = {'trace': 32, 'debug': 34, 'info': 30, 'warn': 35, 'error': 31};
	var logger = {};

	var defineMethod = function(level) {
		var levelStr = level.toUpperCase();
		if (levelStr.length == 4) levelStr += ' ';
		if (useColor) {
			logger[level] = function(msg) {
				sys.puts('\x1B[' + methods[level] + 'm' + getDate() + ' ' + levelStr + ' ' + getClass(module) +':' + getLine(module) + ' - ' + getMessage(msg) + '\x1B[0m');
			};
		} else {
			logger[level] = function(msg) {
				sys.puts(getDate() + ' ' + levelStr + ' ' + getClass(module) +':' + getLine(module) + ' - ' + getMessage(msg));
			};
		}
	}

	for (var level in methods) {
			defineMethod(level);
	}

	return logger;
}