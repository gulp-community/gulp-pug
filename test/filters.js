'use strict';

const test = require('tap').test;

const task = require('../');
const path = require('path');
const fs = require('fs');
const Vinyl = require('vinyl');

const options = {
  filters: {
    shout: function(str) {
      return str.toUpperCase() + '!!!!';
    },
  },
};

const filePath = path.join(__dirname, 'fixtures', 'filters.pug');
const base = path.join(__dirname, 'fixtures');
const cwd = __dirname;

const file = new Vinyl({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.readFileSync(filePath),
});

test(
  'should compile a pug template with a custom pug instance with filters',
  function(t) {
    const stream = task(options);
    stream.on('data', function(newFile) {
      t.ok(newFile);
      t.ok(newFile.contents);
      t.equal(newFile.contents.toString(), 'HELLO, TESTER!!!!');
      t.end();
    });
    stream.write(file);
  }
);
