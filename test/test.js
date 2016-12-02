'use strict';

var test = require('tap').test;

var gulp = require('gulp');
var task = require('../');
var pug = require('pug');
var through = require('through2');
var path = require('path');
var fs = require('fs');
var extname = require('path').extname;
var objectAssign = require('object-assign');

var filename = path.join(__dirname, './fixtures/helloworld.pug');

// Mock Data Plugin
// (not testing the gulp-data plugin options, just that gulp-pug can get its data from file.data)
var setData = function setData() {
  return through.obj(function(file, enc, callback) {
    file.data = {
      title: 'Greetings!'
    };
    this.push(file);
    return callback();
  });
};

var expectStream = function expectStream(t, options, finish) {
  options = options || {};
  if (typeof finish === 'undefined') {
    finish = true;
  }
  var ext = options.client ? '.js' : '.html';
  var compiler = options.client ? pug.compileClient : pug.compile;
  return through.obj(function expectData(file, enc, cb) {
    options.filename = file.path.replace(new RegExp(ext + '$'), '.pug');
    var compiled = compiler(fs.readFileSync(options.filename), options);
    var data = objectAssign({}, options.data, options.locals, file.data);
    var expected = options.client ? compiled : compiled(data);
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
        title: 'Yellow Curled'
      }
    }))
    .pipe(expectStream(t, {
      locals: {
        title: 'Yellow Curled'
      }
    }));
});

test('should compile my pug files into HTML with data', function(t) {
  gulp.src(filename)
    .pipe(task({
      data: {
        title: 'Yellow Curled'
      }
    }))
    .pipe(expectStream(t, {
      data: {
        title: 'Yellow Curled'
      }
    }));
});

test('should compile my pug files into HTML with data property', function(t) {
  gulp.src(filename)
    .pipe(setData())
    .pipe(task())
    .pipe(expectStream(t, {
      data: {
        title: 'Greetings!'
      }
    }));
});

test('should compile my pug files into HTML with data from options and data' +
  ' property', function(t) {
  gulp.src(filename)
    .pipe(setData())
    .pipe(task({
      data: {
        foo: 'bar'
      }
    }))
    .pipe(expectStream(t, {
      data: {
        title: 'Greetings!',
        foo: 'bar'
      }
    }));
});

test('should overwrite data option fields with data property fields when' +
  'compiling my pug files to HTML', function(t) {
  gulp.src(filename)
    .pipe(setData())
    .pipe(task({
      data: {
        title: 'Yellow Curled'
      }
    }))
    .pipe(expectStream(t, {
      data: {
        title: 'Greetings!'
      }
    }));
});

test('should not extend data property fields of other files', function(t) {
  var filename2 = path.join(__dirname, './fixtures/helloworld2.pug');
  var finishedFileCount = 0;

  gulp.src([
    filename,
    filename2
  ])
    .pipe(through.obj(function(file, enc, cb) {
      if (path.basename(file.path) === 'helloworld.pug') {
        file.data = {
          title: 'Greetings!'
        };
      }
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
      client: true
    }))
    .pipe(expectStream(t, {
      client: true
    }));
});

test('should always return contents as buffer with client = true', function(t) {
  gulp.src(filename)
    .pipe(task({
      client: true
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
