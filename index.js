'use strict';

var through = require('through2');
var ext = require('gulp-util').replaceExtension;
var PluginError = require('gulp-util').PluginError;

module.exports = function(opts){
  opts = opts || {};
  var jade = opts.jade || require('jade');

  function CompileJade(file, enc, cb){
    opts.filename = file.path;

    if (file.data) {
      opts.data = file.data;
    }

    file.path = ext(file.path, opts.client ? '.js' : '.html');

    if(file.isStream()){
      return cb(new PluginError('gulp-jade', 'Streaming not supported'));
    }

    if(file.isBuffer()){
      try {
        var compiled;
        var contents = String(file.contents);
        if (opts.client) {
          compiled = jade.compileClient(contents, opts);
        } else {
          compiled = jade.compile(contents, opts)(opts.locals || opts.data);
        }
        file.contents = new Buffer(compiled);
      } catch(e) {
        return cb(new PluginError('gulp-jade', e));
      }
    }
    cb(null, file);
  }

  return through.obj(CompileJade);
};
