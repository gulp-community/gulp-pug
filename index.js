var es = require('event-stream');
var compile = require('jade').compile;
var clone = require('clone');
var ext = require('gulp-util').replaceExtension;

module.exports = function(options){
  'use strict';

  var opts = options ? clone(options) : {};

  function jade(file, callback){
    var newFile = clone(file);
    var compiled = compile(String(newFile.contents), opts);
    if(opts.client){
      newFile.path = ext(newFile.path, '.js');
      newFile.shortened = ext(newFile.shortened, '.js');
      newFile.contents = new Buffer(compiled.toString());
    } else {
      newFile.path = ext(newFile.path, '.html');
      newFile.shortened = ext(newFile.shortened, '.html');
      newFile.contents = new Buffer(compiled(opts.data));
    }

    callback(null, newFile);
  }

  return es.map(jade);
};
