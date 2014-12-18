'use strict';

var test = require('tap').test;

var gulp = require('gulp');
var task = require('../');
var path = require('path');
var through = require('through2');

var filename = path.join(__dirname, './fixtures/jade-error.jade');

test('should emit errors of jade correctly', function(t){
  gulp.src(filename)
    .pipe(task()
      .on('error', function(err){
        t.ok(err);
        t.ok(err instanceof Error);
        t.end();
      }));
});

test('should not emit errors of jade correctly when `logErrors` option is `true`', function(t){
  gulp.src(filename)
  .pipe(task({
    logErrors: true
  })
  .on('error', function (){
    t.notOk(false, 'Error is not expected when `logErrors` is true');
  }))
  .pipe(through.obj(function (){
    t.end();
  }));
});
