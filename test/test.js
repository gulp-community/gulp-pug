'use strict';

const expect = require('expect');
const fs = require('fs');
const gulp = require('gulp');
const { concat, pipe } = require('mississippi');
const path = require('path');
const pug = require('pug');
const through = require('through2');
const task = require('../');

const filename = path.join(__dirname, './fixtures/helloworld.pug');

// Mock Data Plugin
// (not testing the gulp-data plugin options, just that gulp-pug can get its
// data from file.data)
function setData() {
  return through.obj((file, _enc, cb) => {
    file.data = {
      title: 'Greetings!',
    };
    cb(null, file);
  });
}

function expectStream(options) {
  options = options || {};
  const ext = options.client ? '.js' : '.html';
  const compiler = options.client ? pug.compileClient : pug.compile;

  function assert(file, _enc, cb) {
    options.filename = file.path.replace(new RegExp(ext + '$'), '.pug');
    const compiled = compiler(fs.readFileSync(options.filename), options);
    const data = Object.assign({}, options.data, options.locals, file.data);
    const expected = options.client ? compiled : compiled(data);
    expect(file.contents.toString()).toStrictEqual(expected);
    expect(path.extname(file.path)).toStrictEqual(ext);
    if (file.relative) {
      expect(path.extname(file.relative)).toStrictEqual(ext);
    } else {
      expect(path.extname(file.relative)).toStrictEqual('');
    }
    cb(null, file);
  }

  return through.obj(assert);
}

describe('test', function() {
  it('should compile my pug files into HTML', function(done) {
    pipe([
      gulp.src(filename),
      task(),
      expectStream(),
      concat(),
    ], done);
  });

  it('should compile my pug files into HTML with locals', function(done) {
    const options = {
      locals: {
        title: 'Yellow Curled',
      },
    };

    pipe([
      gulp.src(filename),
      task(options),
      expectStream(options),
      concat(),
    ], done);
  });

  it('should compile my pug files into HTML with data', function(done) {
    const options = {
      data: {
        title: 'Yellow Curled',
      },
    };

    pipe([
      gulp.src(filename),
      task(options),
      expectStream(options),
      concat(),
    ], done);
  });

  it('should compile my pug files into HTML with data property', function(done) {
    pipe([
      gulp.src(filename),
      setData(),
      task(),
      expectStream({ data: { title: 'Greetings' } }),
      concat(),
    ], done);
  });

  it('should compile my pug files into HTML with data from options and data property', function(done) {
    pipe([
      gulp.src(filename),
      setData(),
      task({ data: { foo: 'bar' } }),
      expectStream({ data: { title: 'Greetings', foo: 'bar' } }),
      concat(),
    ], done);
  });

  it('should overwrite data option fields with data property fields when compiling my pug files to HTML', function(done) {
    pipe([
      gulp.src(filename),
      setData(),
      task({ data: { title: 'Yellow Curled' } }),
      expectStream({ data: { title: 'Greetings' } }),
      concat(),
    ], done);
  });

  it('should not extend data property fields of other files', function(done) {
    const filename2 = path.join(__dirname, './fixtures/helloworld2.pug');

    pipe([
      gulp.src([filename, filename2]),
      through.obj((file, _enc, cb) => {
        if (path.basename(file.path) === 'helloworld.pug') {
          file.data = {
            title: 'Greetings!',
          };
        }
        cb(null, file);
      }),
      task(),
      expectStream(),
      concat(),
    ], done);
  });

  it('should compile my pug files into JS', function(done) {
    const options = { client: true };

    pipe([
      gulp.src(filename),
      task(options),
      expectStream(options),
      concat(),
    ], done);
  });

  it('should always return contents as buf with client = true', function(done) {
    function assert(files) {
      expect(files.length).toEqual(1);
      const newFile = files[0];
      expect(newFile.contents).toBeInstanceOf(Buffer);
    }

    pipe([
      gulp.src(filename),
      task({ client: true }),
      concat(assert),
    ], done);
  });

  it('should always return contents as buf with client = false', function(done) {
    function assert(files) {
      expect(files.length).toEqual(1);
      const newFile = files[0];
      expect(newFile.contents).toBeInstanceOf(Buffer);
    }

    pipe([
      gulp.src(filename),
      task(),
      concat(assert),
    ], done);
  });
});
