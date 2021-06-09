'use strict';

const through = require('through2');
const defaultPug = require('pug');
const ext = require('replace-ext');
const PluginError = require('plugin-error');
const log = require('fancy-log');
const vinylContents = require('vinyl-contents');

module.exports = function gulpPug(options) {
  const opts = Object.assign({}, options);
  const pug = opts.pug || opts.jade || defaultPug;

  opts.data = Object.assign(opts.data || {}, opts.locals || {});

  return through.obj(function compilePug(file, enc, cb) {
    const data = Object.assign({}, opts.data, file.data || {});

    opts.filename = file.path;
    file.path = ext(file.path, opts.client ? '.js' : '.html');

    vinylContents(file, function onContents(err, contents) {
      if (err) {
        return cb(
          new PluginError('gulp-pug', err, { fileName: opts.filename })
        );
      }

      if (!contents) {
        return cb(null, file);
      }

      try {
        let compiled;

        if (opts.verbose === true) {
          log('compiling file', file.path);
        }
        if (opts.client) {
          compiled = pug.compileClient(contents, opts);
        } else {
          compiled = pug.compile(contents, opts)(data);
        }
        file.contents = Buffer.from(compiled);
      } catch (err) {
        return cb(
          new PluginError('gulp-pug', err, { fileName: opts.filename })
        );
      }

      cb(null, file);
    });
  });
};
