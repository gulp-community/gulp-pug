'use strict';

const expect = require('expect');
const { concat, from, pipe } = require('mississippi');
const task = require('../');
const { getFixture } = require('./get-fixture');

const options = {
  filters: {
    shout: function (str) {
      return str.toUpperCase() + '!!!!';
    },
  },
};

describe('filters', function () {
  it('should compile a pug template with a custom pug instance with filters', function (done) {
    function assert(files) {
      expect(files.length).toEqual(1);
      const newFile = files[0];
      expect(newFile).toMatchObject({
        contents: Buffer.from('HELLO, TESTER!!!!'),
      });
    }

    pipe(
      [from.obj([getFixture('filters.pug')]), task(options), concat(assert)],
      done
    );
  });
});
