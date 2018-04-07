'use strict';

const test = require('tap').test;

const task = require('../');
const path = require('path');
const fs = require('fs');
const gutil = require('gulp-util');

const filePath = path.join(__dirname, 'fixtures', 'extends.pug');
const base = path.join(__dirname, 'fixtures');
const cwd = __dirname;

const file = new gutil.File({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.readFileSync(filePath),
});

test('should compile a pug template with an extends', function(t) {
  const stream = task();
  stream.on('data', function(newFile) {
    t.ok(newFile);
    t.ok(newFile.contents);
    t.equal(newFile.contents.toString(), '<div><h1>Hello World</h1></div>');
    t.end();
  });
  stream.write(file);
});
