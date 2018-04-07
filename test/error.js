'use strict';

const test = require('tap').test;

const gulp = require('gulp');
const task = require('../');
const path = require('path');

const filename = path.join(__dirname, './fixtures/pug-error.pug');

test('should emit errors of pug correctly', function(t) {
  gulp.src(filename)
    .pipe(task()
      .on('error', function(err) {
        t.ok(err);
        t.ok(err instanceof Error);
        t.end();
      }));
});
