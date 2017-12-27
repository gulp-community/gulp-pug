'use strict';

var test = require('tap').test;

var task = require('../');

var path = require('path');
var fs = require('fs');
var Vinyl = require('vinyl');
var PluginError = require('plugin-error');

var filePath = path.join(__dirname, 'fixtures', 'helloworld.pug');
var base = path.join(__dirname, 'fixtures');
var cwd = __dirname;

var file = new Vinyl({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.createReadStream(filePath)
});

test('should error if contents is a stream', function(t) {
  var stream = task();
  stream.on('error', function(err) {
    t.ok(err instanceof PluginError, 'not an instance of PluginError');
    t.end();
  });
  stream.write(file);
  stream.end();
});
