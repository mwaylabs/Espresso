/*!
 * renderer.js
 * 
 * Abstract Mustache rendering into less noisier functions
 *
 * Copyright(c) 2011 M-Way Solutions GmbH. All rights reserved.
 * MIT and GPL Licensed
 *
 * @author pfleidi
 */


/*
 * import dependencies 
 */
var Mu = require('../lib/Mu');
var Fs = require('fs');
var Utils = require('./espresso_utils');

/**
 * Factory function to create renderer
 *
 * @param {String} templatePath
 * @return {Object}
 * @api public
 */
exports.createRenderer = function (templatePath) {
  // setting the template sources
  Mu.templateRoot = templatePath;

  /**
   * Render a template and save it to a specified path
   *
   * @param {Object} options
   * @return undefined
   * @api public
   */
  function _render(options) {
    var template = options.templateFile;

    Mu.render(template, options.ctx, {}, function (err, output) {
        var buffer = '';

        if (err) {
          options.callback(err);
        }
        output.on('data', function (chunk) {
            buffer += chunk;
          });

        output.on('end', function () {
            Utils.fileExists(options.outputPath, function (exists) {
                if (!exists) {
                  Fs.writeFile(options.outputPath, buffer, function (err) {
                      if (err) {
                        options.callback(err);
                      }
                      Utils.log(template + ' generated!');
                      options.callback(null);
                    });
                } else {
                  options.callback(new Error('File ' + options.outputPath + ' already exists'));
                }
              });
          });
      });
  }

  /* return the API */
  return {
    render: _render
  };
};
