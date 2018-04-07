'use strict';

const test = require('tap').test;

const task = require('../');

const path = require('path');
const fs = require('fs');
const File = require('gulp-util').File;
const PluginError = require('gulp-util').PluginError;

const filePath = path.join(__dirname, 'fixtures', 'helloworld.pug');
const base = path.join(__dirname, 'fixtures');
const cwd = __dirname;

const file = new File({
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
