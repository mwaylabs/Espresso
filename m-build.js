// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      08.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var espresso  = require('./core/espresso').Espresso;

var server = new espresso.Server();

var app = server.getNewApp();

app.addTaskChain();

app.loadTheMProject();




app.build(function (opt) {
    app.saveLocal(opt);
});





