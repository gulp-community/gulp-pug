'use strict';

const expect = require('expect');
const { concat, from, pipe } = require('mississippi');
const task = require('../');
const { getFixture } = require('./get-fixture');

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
      from.obj([getFixture('extends.pug')]),
      task(),
      concat(assert),
    ], done);
  });
});
