'use strict';

const expect = require('expect');
const fs = require('fs');
const { concat, from, pipe } = require('mississippi');
const path = require('path');
const Vinyl = require('vinyl');
const pug = require('pug');

const plugin = require('../');

const cwd = __dirname;
const base = path.join(cwd, 'fixtures');
const filePath = path.join(base, 'helloworld.pug');
const fileContents = fs.readFileSync(filePath);

const file = new Vinyl({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.createReadStream(filePath),
});

describe('stream', function() {
  it('should error if contents is a stream', function(done) {
    function assert(files) {
      var expected = pug.compile(fileContents)();
      expect(files[0]).not.toBeUndefined();
      expect(expected).toEqual(String(files[0].contents));
    }

    pipe([
      from.obj([file]),
      plugin(),
      concat(assert),
    ], done);
  });
});
