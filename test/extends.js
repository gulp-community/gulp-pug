'use strict';

var test = require('tap').test;

var task = require('../');
var path = require('path');
var fs = require('fs');
var Vinyl = require('vinyl');

var filePath = path.join(__dirname, 'fixtures', 'extends.pug');
var base = path.join(__dirname, 'fixtures');
var cwd = __dirname;

var file = new Vinyl({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.readFileSync(filePath)
});

test('should compile a pug template with an extends', function(t) {
  var stream = task();
  stream.on('data', function(newFile) {
    t.ok(newFile);
    t.ok(newFile.contents);
    t.equal(newFile.contents.toString(), '<div><h1>Hello World</h1></div>');
    t.end();
  });
  stream.write(file);
});
