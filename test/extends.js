'use strict';

const expect = require('expect');
const fs = require('fs');
const { concat, from, pipe } = require('mississippi');
const path = require('path');
const Vinyl = require('vinyl');
const task = require('../');

const filePath = path.join(__dirname, 'fixtures', 'extends.pug');
const base = path.join(__dirname, 'fixtures');
const cwd = __dirname;

const file = new Vinyl({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.readFileSync(filePath),
});

describe('extends', function() {
  it('should compile a pug template with an extends', function(done) {
    function assert(files) {
      expect(files.length).toEqual(1);
      const newFile = files[0];
      expect(newFile).toMatchObject({
        contents: Buffer.from('<div><h1>Hello World</h1></div>'),
      });
    }

    pipe([
      from.obj([file]),
      task(),
      concat(assert),
    ], done);
  });
});
