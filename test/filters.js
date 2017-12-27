'use strict';

var test = require('tap').test;

var task = require('../');
var path = require('path');
var fs = require('fs');
var Vinyl = require('vinyl');

var options = {
  filters: {
    shout: function(str) {
      return str.toUpperCase() + '!!!!';
    }
  }
};

var filePath = path.join(__dirname, 'fixtures', 'filters.pug');
var base = path.join(__dirname, 'fixtures');
var cwd = __dirname;

var file = new Vinyl({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.readFileSync(filePath)
});

test('should compile a pug template with a custom pug instance with filters',
function(t) {
  var stream = task(options);
  stream.on('data', function(newFile) {
    t.ok(newFile);
    t.ok(newFile.contents);
    t.equal(newFile.contents.toString(), 'HELLO, TESTER!!!!');
    t.end();
  });
  stream.write(file);
});
