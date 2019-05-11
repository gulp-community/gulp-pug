'use strict';

const expect = require('expect');
const fs = require('fs');
const { concat, from, pipe } = require('mississippi');
const path = require('path');
const PluginError = require('plugin-error');
const Vinyl = require('vinyl');
const task = require('../');

const cwd = __dirname;
const base = path.join(cwd, 'fixtures');
const filePath = path.join(base, 'helloworld.pug');

const file = new Vinyl({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.createReadStream(filePath),
});

describe('stream', function() {
  it('should error if contents is a stream', function(done) {
    pipe([
      from.obj([file]),
      task(),
      concat(),
    ], (err) => {
      expect(err).toBeInstanceOf(PluginError);
      done();
    });
  });
});
