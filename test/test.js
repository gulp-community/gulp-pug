'use strict';

var test = require('tap').test;

var gulp = require('gulp');
var task = require('../');
var jade = require('jade');
var es = require('event-stream');
var path = require('path');
var fs = require('fs');
var extname = require('path').extname;

var filename = path.join(__dirname, './fixtures/helloworld.jade');

function expectStream(t, options){
  options = options || {};
  var ext = options.client ? '.js' : '.html';
  return es.map(function(file){
    options.filename = filename;
    var compiled = jade.compile(fs.readFileSync(filename), options);
    var expected = options.client ? compiled.toString() : compiled(options.data);
    t.equal(expected, String(file.contents));
    t.equal(extname(file.path), ext);
    if(file.relative){
      t.equal(extname(file.relative), ext);
    } else {
      t.equal(extname(file.relative), '');
    }
    t.end();
  });
}

test('should compile my jade files into HTML', function(t){
  gulp.src(filename)
    .pipe(task())
    .pipe(expectStream(t));
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
    .pipe(es.map(function(file){
      t.ok(file.contents instanceof Buffer);
      t.end();
    }));
});

test('should always return contents as buffer with client = false', function(t){
  gulp.src(filename)
    .pipe(task())
    .pipe(es.map(function(file){
      t.ok(file.contents instanceof Buffer);
      t.end();
    }));
});
