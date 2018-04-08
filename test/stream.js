'use strict';

const test = require('tap').test;

const task = require('../');

const path = require('path');
const fs = require('fs');
const Vinyl = require('vinyl');
const PluginError = require('plugin-error');

const filePath = path.join(__dirname, 'fixtures', 'helloworld.pug');
const base = path.join(__dirname, 'fixtures');
const cwd = __dirname;

const file = new Vinyl({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.createReadStream(filePath),
});

test('should error if contents is a stream', function(t) {
  const stream = task();
  stream.on('error', function(err) {
    t.ok(err instanceof PluginError, 'not an instance of PluginError');
    t.end();
  });
  stream.write(file);
  stream.end();
});
