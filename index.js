var es = require('event-stream');
var compile = require('jade').compile;
var ext = require('gulp-util').replaceExtension;

module.exports = function(options){
  'use strict';

  var opts = options ? options : {};

  function jade(file, callback){
    opts.filename = file.path;
    var compiled = compile(String(file.contents), opts);
    if(opts.client){
      file.path = ext(file.path, '.js');
      file.contents = new Buffer(compiled.toString());
    } else {
      file.path = ext(file.path, '.html');
      file.contents = new Buffer(compiled(opts.data));
    }

    callback(null, file);
  }

  return es.map(jade);
};
