'use strict';

var test = require('tap').test;

var task = require('../');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');

var filePath = path.join(__dirname, 'fixtures', 'markdown.jade');
var base = path.join(__dirname, 'fixtures');
var cwd = __dirname;

var file = new gutil.File({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.readFileSync(filePath)
});

test('should compile my jade files with markdown content into HTML', function(t){
  var stream = task();
  stream.on('data', function(newFile){
    t.ok(newFile);
    t.ok(newFile.contents);
    t.equal(newFile.contents.toString(), '<p>This is a block of text in <strong>markdown</strong> format</p>\n');
    t.end();
  });
  stream.write(file);
});
