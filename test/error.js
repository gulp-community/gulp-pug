'use strict';

const expect = require('expect');
const gulp = require('gulp');
const { concat, pipe } = require('mississippi');
const path = require('path');
const PluginError = require('plugin-error');
const task = require('../');

const filename = path.join(__dirname, './fixtures/pug-error.pug');

describe('error', function() {
  it('should emit errors of pug correctly', function(done) {
    pipe(
      [gulp.src(filename), task(), concat()],
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
