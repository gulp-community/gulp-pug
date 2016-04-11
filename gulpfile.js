'use strict';

var gulp = require('pug');
var jshint = require('gulp-jshint');

gulp.task('jshint', function(){
  gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter());
});
