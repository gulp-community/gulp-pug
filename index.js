'use strict';

const through = require('through2');
const ext = require('gulp-util').replaceExtension;
const PluginError = require('gulp-util').PluginError;
const defaultJade = require('jade');


module.exports = function (options) {
  options = options || {};
  var jade = options.jade || defaultJade;

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new PluginError('gulp-jade', 'Streaming not supported'));
    }

    if (file.isBuffer()) {
      options.filename = file.path;
      file.path = ext(file.path, options.client ? '.js' : '.html');
      var data = file.data || options.locals || options.data;

      try {
        if (options.client) {
          compileClient(this, file);
        } else {
          compile(this, file, data);
        }
      } catch (e) {
        return cb(new PluginError('gulp-jade', e));
      }

      cb();
    }
  });

  function compileClient(stream, file) {
    var compiled = jade.compileClient(String(file.contents), options);
    file.contents = new Buffer(compiled);
    stream.push( file );
  }

  function compile(stream, file, data) {
    var tpl = jade.compile(String(file.contents), options);
    var render = options.render || defaultRender;
    render.call(stream, tpl, data, file);
  }

  function defaultRender(tpl, data, file) {
    file.contents = new Buffer(tpl(data));
    this.push(file);
  }

};
