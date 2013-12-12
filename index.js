'use strict';

var es = require('event-stream');
var compile = require('jade').compile;
var ext = require('gulp-util').replaceExtension;
var isStream = require('gulp-util').isStream;
var isBuffer = require('gulp-util').isBuffer;

module.exports = function(options){
  var opts = options || {};

  function jade(file, callback){
    if(!isBuffer(file.contents) && !isStream(file.contents)){
      return callback(new Error('gulp-jade: file contents must be a buffer or stream'));
    }

    opts.filename = file.path;

    if(opts.client){
      file.path = ext(file.path, '.js');
    } else {
      file.path = ext(file.path, '.html');
    }

    if(isStream(file.contents)){
      var throughStream = es.through();
      var waitStream = es.wait(function(err, data){
        var compiled = compile(data, opts);
        if(opts.client){
          throughStream.write(compiled.toString());
        } else {
          throughStream.write(compiled(opts.data));
        }
      });
      file.contents.pipe(waitStream);
      file.contents = throughStream;
      return callback(null, file);
    }

    var compiled = compile(String(file.contents), opts);

    if(opts.client){
      file.contents = new Buffer(compiled.toString());
    } else {
      file.contents = new Buffer(compiled(opts.data));
    }

    return callback(null, file);
  }

  return es.map(jade);
};
