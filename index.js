'use strict';

var through = require('through2');
var compile = require('jade').compile;
var compileClient = require('jade').compileClient;
var ext = require('gulp-util').replaceExtension;
var path = require('path');
var PluginError = require('gulp-util').PluginError;

function handleCompile(contents, opts, data){
  if(opts.client){
    return compileClient(contents, opts);
  }

  return compile(contents, opts)(data);
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
    
    
    //make both synchronous and asynchronous data parameters act the same way
    var dataFunction = opts.locals||opts.data;
    if(typeof dataFunction != 'function'){
    	dataFunction = function(filepath,_cb){    		
    		_cb(opts.locals||opts.data);
    	};
    }
    
    //do this async with file.path used to give difference possible data results
    var self = this;
    var filepath = path.relative(file.base,file.path);
    dataFunction(filepath,function(data){
    	
    	if(file.isBuffer()){
    	      try {
    	        file.contents = new Buffer(handleCompile(String(file.contents), opts, data));
    	      } catch(e) {
    	    	  self.emit('error', e);
    	      }
    	}

    	self.push(file);
    	cb();
    });
    
    
  }

  return through.obj(CompileJade);
};