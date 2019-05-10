'use strict';

const expect = require('expect');
const { concat, from, pipe } = require('mississippi');
const PluginError = require('plugin-error');
const task = require('../');
const { getFixture } = require('./get-fixture');

describe('error', function() {
  it('should emit errors of pug correctly', function(done) {
    pipe(
      [from.obj([getFixture('pug-error.pug')]), task(), concat()],
      (err) => {
        try {
          expect(err).toBeInstanceOf(PluginError);
          done();
        } catch (err) {
          done(err);
        }
      }
    );
  });
});
