// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: ©2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   alexander
// Date:      29.10.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var espresso  = require('../../Espresso/core/espresso').Espresso;

var server = new espresso.Server();

var app = server.getNewApp({

    "name" : "todos",
    "pathName" : "",
    "buildLanguage" : "en",
    "theme" : "m-deafult",
    "execPath" : __dirname, /*the a actually folder name, in which this files is executed.*/
    "jslintCheck" : true

});

app.loadTheApplication();

app.loadTheMProject();




app.build(function (opt) {
    server.run(opt);
});





