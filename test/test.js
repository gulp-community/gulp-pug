'use strict';

const test = require('tap').test;

const gulp = require('gulp');
const task = require('../');
const pug = require('pug');
const through = require('through2');
const path = require('path');
const fs = require('fs');
const extname = require('path').extname;

const filename = path.join(__dirname, './fixtures/helloworld.pug');

// Mock Data Plugin
// (not testing the gulp-data plugin options, just that gulp-pug can get its
// data from file.data)
const setData = function setData() {
  return through.obj(function(file, enc, callback) {
    file.data = {
      title: 'Greetings!',
    };
    // eslint-disable-next-line no-invalid-this
    this.push(file);
    return callback();
  });
};

const expectStream = function expectStream(t, options, finish) {
  options = options || {};
  if (typeof finish === 'undefined') {
    finish = true;
  }
  const ext = options.client ? '.js' : '.html';
  const compiler = options.client ? pug.compileClient : pug.compile;
  return through.obj(function expectData(file, enc, cb) {
    options.filename = file.path.replace(new RegExp(ext + '$'), '.pug');
    const compiled = compiler(fs.readFileSync(options.filename), options);
    const data = Object.assign({}, options.data, options.locals, file.data);
    const expected = options.client ? compiled : compiled(data);
    t.equal(expected, String(file.contents));
    t.equal(extname(file.path), ext);
    if (file.relative) {
      t.equal(extname(file.relative), ext);
    } else {
      t.equal(extname(file.relative), '');
    }
    if (finish) {
      t.end();
    }
    // eslint-disable-next-line no-invalid-this
    this.push(file);
    cb();
  });
};

test('should compile my pug files into HTML', function(t) {
  gulp.src(filename)
    .pipe(task())
    .pipe(expectStream(t));
});

test('should compile my pug files into HTML with locals', function(t) {
  gulp.src(filename)
    .pipe(task({
      locals: {
        title: 'Yellow Curled',
      },
    }))
    .pipe(expectStream(t, {
      locals: {
        title: 'Yellow Curled',
      },
    }));
});

test('should compile my pug files into HTML with data', function(t) {
  gulp.src(filename)
    .pipe(task({
      data: {
        title: 'Yellow Curled',
      },
    }))
    .pipe(expectStream(t, {
      data: {
        title: 'Yellow Curled',
      },
    }));
});

test('should compile my pug files into HTML with data property', function(t) {
  gulp.src(filename)
    .pipe(setData())
    .pipe(task())
    .pipe(expectStream(t, {
      data: {
        title: 'Greetings!',
      },
    }));
});

test('should compile my pug files into HTML with data from options and data' +
  ' property', function(t) {
  gulp.src(filename)
    .pipe(setData())
    .pipe(task({
      data: {
        foo: 'bar',
      },
    }))
    .pipe(expectStream(t, {
      data: {
        title: 'Greetings!',
        foo: 'bar',
      },
    }));
});

test('should overwrite data option fields with data property fields when' +
  'compiling my pug files to HTML', function(t) {
  gulp.src(filename)
    .pipe(setData())
    .pipe(task({
      data: {
        title: 'Yellow Curled',
      },
    }))
    .pipe(expectStream(t, {
      data: {
        title: 'Greetings!',
      },
    }));
});

test('should not extend data property fields of other files', function(t) {
  const filename2 = path.join(__dirname, './fixtures/helloworld2.pug');
  let finishedFileCount = 0;

  gulp.src([
    filename,
    filename2,
  ])
    .pipe(through.obj(function(file, enc, cb) {
      if (path.basename(file.path) === 'helloworld.pug') {
        file.data = {
          title: 'Greetings!',
        };
      }
      // eslint-disable-next-line no-invalid-this
      this.push(file);
      cb();
    }))
    .pipe(task())
    .pipe(expectStream(t, {}, false))
    .pipe(through.obj(function(file, enc, cb) {
      if (++finishedFileCount === 2) {
        t.end();
      }
      cb();
    }));
});

test('should compile my pug files into JS', function(t) {
  gulp.src(filename)
    .pipe(task({
      client: true,
    }))
    .pipe(expectStream(t, {
      client: true,
    }));
});

test('should replace the template name with function result', function(t) {
  const filename2 = path.join(__dirname, './fixtures/helloworld2.pug');
  let finishedFileCount = 0;
  gulp.src([filename, filename2])
    .pipe(task({
      client: true,
      name: function(file) {
        if (!file || !file.path) {
          return 'template';
        }
        return '__' + path.basename(file.path, path.extname(file.path)) + '__';
      },
    }))
    .pipe(through.obj(function(file, enc, cb) {
      t.ok(file.contents instanceof Buffer);
      let expected = 'function __'
          + path.basename(file.path, path.extname(file.path))
          + '__(';
      t.ok(String(file.contents).indexOf(expected) >= 0);
      if (++finishedFileCount === 2) {
        t.end();
      }
      cb();
    }));
});


test('should always return contents as buffer with client = true', function(t) {
  gulp.src(filename)
    .pipe(task({
      client: true,
    }))
    .pipe(through.obj(function(file, enc, cb) {
      t.ok(file.contents instanceof Buffer);
      t.end();
      cb();
    }));
});

test('should always return contents as buf with client = false', function(t) {
  gulp.src(filename)
    .pipe(task())
    .pipe(through.obj(function(file, enc, cb) {
      t.ok(file.contents instanceof Buffer);
      t.end();
      cb();
    }));
});
