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
var Util = require('util');

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
            Fs.writeFile(options.outputPath, buffer, function (err) {
                if (err) {
                  options.callback(err);
                }
                Util.puts(template + ' generated!');
                options.callback(null);
              });
          });
      });
  }

  /* return the API */
  return {
    render: _render
  };
};
