'use strict';

var test = require('tap').test;

var gulp = require('gulp');
var task = require('../');
var jade = require('jade');
var through = require('through2');
var path = require('path');
var fs = require('fs');
var extname = require('path').extname;

var filename = path.join(__dirname, './fixtures/helloworld.jade');

function expectStream(t, options){
  options = options || {};
  var ext = options.client ? '.js' : '.html';
  var compiler = options.client ? jade.compileClient : jade.compile;
  return through.obj(function(file, enc, cb){
    options.filename = filename;
    var compiled = compiler(fs.readFileSync(filename), options);
    var expected = options.client ? compiled : compiled(options.data);
    t.equal(expected, String(file.contents));
    t.equal(extname(file.path), ext);
    if(file.relative){
      t.equal(extname(file.relative), ext);
    } else {
      t.equal(extname(file.relative), '');
    }
    t.end();
    cb();
  });
}

test('should compile my jade files into HTML', function(t){
  gulp.src(filename)
    .pipe(task())
    .pipe(expectStream(t));
});

test('should compile my jade files into HTML with locals passed in', function(t){
  gulp.src(filename)
    .pipe(task({
      locals: 'Yellow Curled'
    }))
    .pipe(expectStream(t, {
      locals: 'Yellow Curled'
    }));
});

test('should compile my jade files into HTML with data passed in', function(t){
  gulp.src(filename)
    .pipe(task({
      data: 'Yellow Curled'
    }))
    .pipe(expectStream(t, {
      data: 'Yellow Curled'
    }));
});

test('should compile my jade files into JS', function(t){
  gulp.src(filename)
    .pipe(task({
      client: true
    }))
    .pipe(expectStream(t, {
      client: true
    }));
});

test('should always return contents as buffer with client = true', function(t){
  gulp.src(filename)
    .pipe(task({
      client: true
    }))
    .pipe(through.obj(function(file, enc, cb){
      t.ok(file.contents instanceof Buffer);
      t.end();
      cb();
    }));
});

test('should always return contents as buffer with client = false', function(t){
  gulp.src(filename)
    .pipe(task())
    .pipe(through.obj(function(file, enc, cb){
      t.ok(file.contents instanceof Buffer);
      t.end();
      cb();
    }));
});
