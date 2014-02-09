'use strict';

var through = require('through2');
var compile = require('jade').compile;
var compileClient = require('jade').compileClient;
var ext = require('gulp-util').replaceExtension;
var PluginError = require('gulp-util').PluginError;

function handleCompile(contents, opts){
  if(opts.client){
    return compileClient(contents, opts);
  }

  return compile(contents, opts)(opts.locals || opts.data);
}

function handleExtension(filepath, opts){
  if(opts.client){
    return ext(filepath, '.js');
  }

  return ext(filepath, '.html');
}

module.exports = function(options){
  var opts = options || {};

  function CompileJade(file, enc, cb){
    opts.filename = file.path;
    file.path = handleExtension(file.path, opts);

    if(file.isStream()){
      this.emit('error', new PluginError('gulp-jade', 'Streaming not supported'));
      return cb();
    }

    if(file.isBuffer()){
      try {
        file.contents = new Buffer(handleCompile(String(file.contents), opts));
      } catch(e) {
        this.emit('error', e);
      }
    }

    this.push(file);
    cb();
  }

  return through.obj(CompileJade);
};
