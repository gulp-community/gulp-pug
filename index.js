'use strict';

var es = require('event-stream');
var compile = require('jade').compile;
var compileClient = require('jade').compileClient;
var ext = require('gulp-util').replaceExtension;
var isStream = require('gulp-util').isStream;
var isBuffer = require('gulp-util').isBuffer;

function handleCompile(contents, opts){
  if(opts.client){
    return compileClient(contents, opts).toString();
  }

  return compile(contents, opts)(opts.data);
}

function handleExtension(filepath, opts){
  if(opts.client){
    return ext(filepath, '.js');
  }

  return ext(filepath, '.html');
}

module.exports = function(options){
  var opts = options || {};

  function jade(file, callback){
    opts.filename = file.path;
    file.path = handleExtension(file.path, opts);

    if(isStream(file.contents)){
      var throughStream = es.through();
      var waitStream = es.wait(function(err, data){
        throughStream.write(handleCompile(data, opts));
        throughStream.end();
      });
      file.contents.pipe(waitStream);
      file.contents = throughStream;
    }

    if(isBuffer(file.contents)){
      file.contents = new Buffer(handleCompile(String(file.contents), opts));
    }

    callback(null, file);
  }

  return es.map(jade);
};
