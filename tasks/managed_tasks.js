// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      08.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


var ManagedTasks

/*
 * ESPRESSO
 */
ManagedTasks = exports.ManagedTasks = {};
ManagedTasks.Tasks = new Array();

/*
 * The Tasks
 */
ManagedTasks.Tasks['dependency'] =  require('./dependencyTask').Task_Dependency;
ManagedTasks.Tasks['jslint'] =  require('./jslintTask').Task_JSLINT;
ManagedTasks.Tasks['T1'] =  require('./t1.js').T1;
ManagedTasks.Tasks['T2'] =  require('./t2.js').T2;
ManagedTasks.Tasks['T3'] =  require('./t3.js').T3;

