'use strict';

var test = require('tap').test;

var task = require('../');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');
var jade = require('jade');

jade.filters.shout = function(str){
  return str.toUpperCase() + '!!!!';
};

var filePath = path.join(__dirname, 'fixtures', 'filters.jade');
var base = path.join(__dirname, 'fixtures');
var cwd = __dirname;

var file = new gutil.File({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.readFileSync(filePath)
});

test('should compile a jade template with a custom jade instance with filters', function(t){
  var stream = task();
  stream.on('data', function(newFile){
    t.ok(newFile);
    t.ok(newFile.contents);
    t.equal(newFile.contents.toString(), 'HELLO, TESTER!!!!');
    t.end();
  });
  stream.write(file);
});
