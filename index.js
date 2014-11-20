'use strict';

var through = require('through2');
var ext = require('gulp-util').replaceExtension;
var PluginError = require('gulp-util').PluginError;


module.exports = function(options){
  var opts = options || {};
  var jade = opts.jade || require('jade');
  var compile = jade.compile;
  var compileClient = jade.compileClient;

  function handleCompile(contents){
    if(opts.client){
      return compileClient(contents, opts);
    }

    return compile(contents, opts)(opts.locals || opts.data);
  }

  function handleExtension(filepath){
    if(opts.client){
      return ext(filepath, '.js');
    }
    return ext(filepath, '.html');
  }

  function CompileJade(file, enc, cb){
    opts.filename = file.path;

    if (file.data) {
      opts.data = file.data;
    }

    file.path = handleExtension(file.path);

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
