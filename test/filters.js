'use strict';

const expect = require('expect');
const fs = require('fs');
const { concat, from, pipe } = require('mississippi');
const path = require('path');
const Vinyl = require('vinyl');
const task = require('../');

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

describe('filters', function() {
  it('should compile a pug template with a custom pug instance with filters', function(done) {
    function assert(files) {
      expect(files.length).toEqual(1);
      const newFile = files[0];
      expect(newFile).toMatchObject({
        contents: Buffer.from('HELLO, TESTER!!!!'),
      });
    }

    pipe([
      from.obj([file]),
      task(options),
      concat(assert),
    ], done);
  });
});
