'use strict';

var jade = require('jade');
var extend = require('xtend');
var through = require('through2');
var ext = require('gulp-util').replaceExtension;
var PluginError = require('gulp-util').PluginError;

function handleCompile(contents, opts){
  if(opts.client){
    return opts.compileClient(contents, opts);
  }

  return opts.compile(contents, opts)(opts.locals || opts.data);
}

function handleExtension(filepath, opts){
  if(opts.client){
    return ext(filepath, '.js');
  }
  return ext(filepath, '.html');
}

module.exports = function(options){
  options = options || {};
  var opts = extend(options, {
    compile: (options.jade || jade).compile,
    compileClient: (options.jade || jade).compileClient
  });

  function CompileJade(file, enc, cb){
    opts.filename = file.path;

    if (file.data) {
      opts.data = file.data;
    }

    file.path = handleExtension(file.path, opts);

    if(file.isStream()){
      return cb(new PluginError('gulp-jade', 'Streaming not supported'));
    }

    if(file.isBuffer()){
      try {
        file.contents = new Buffer(handleCompile(String(file.contents), opts));
      } catch(e) {
        return cb(new PluginError('gulp-jade', e));
      }
    }
    cb(null, file);
  }

  return through.obj(CompileJade);
};
