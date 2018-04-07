'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('eslint', function() {
  return gulp.src(['*.js', 'test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
