// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      08.02.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 * Mark a framework as Core Framework to be included in index.html.
 *
 * @extends Task
 */
Task = exports.Task = function() {
  this.name = 'markCoreFramework';
};

Task.prototype = new (require('./task').Task)();

Task.prototype.duty = function (framework, callback){
  framework.app.coreFrameworks[framework.name] = framework;
  callback(framework);
};
