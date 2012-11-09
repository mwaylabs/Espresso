// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   alexander
// Date:      06.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

var Task_PreloadImages,
    Task = require('./task').Task;

/**
 * @class
 * This Task checks files in a framework, if some files are exclude
 * from caching the files on the device.
 *
 * @extends Task
 */
Task_PreloadImages = exports.Task_PreloadImages = function () {
    /* Properties */
    this.name = 'preloadImages';
};

/**
 * @description
 * Get the run() function from Task.
 * @property TODO
 */
Task_PreloadImages.prototype = new Task();

/**
 * @description
 * The concrete duty this task has to achieve.
 * @param framework
 * @param callback
 */
Task_PreloadImages.prototype.duty = function (framework, callback) {
    var that = this,
        _app = framework.app;
    framework.files.forEach(function (file) {
        if (file.isImage) {
            _app.filesToPreload.push(file.requestPath);
        }
    });
    callback(framework);
};