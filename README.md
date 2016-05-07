[![Build Status](https://travis-ci.org/phated/gulp-jade.png?branch=master)](https://travis-ci.org/phated/gulp-jade)

## Information

<table>
<tr>
<td>Package</td><td>gulp-pug</td>
</tr>
<tr>
<td>Description</td>
<td>Compile Pug templates</td>
</tr>
<tr>
<td>Node Version</td>
<td>≥ 0.10</td>
</tr>
</table>

## Usage

Compile to HTML

```javascript
var pug = require('gulp-pug');

gulp.task('templates', function() {
  var YOUR_LOCALS = {};

  gulp.src('./lib/*.pug')
    .pipe(pug({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./dist/'))
});
```

Compile to JS

```javascript
var pug = require('gulp-pug');

gulp.task('templates', function() {
  gulp.src('./lib/*.pug')
    .pipe(pug({
      client: true
    }))
    .pipe(gulp.dest('./dist/'))
});
```

## Options

All options supported by the [Pag API](http://jade-lang.com/api/) are supported

__Note:__ `filename` option is taken from `path` property of incoming vinyl-file object. If you want to change it, use [gulp-rename](https://github.com/hparra/gulp-rename) before `gulp-pug` with desired path.

In addition, you can pass in a `locals` or `data` option that will be used as locals for your HTML compilation.  The `locals` option takes precedence over the `data` option, and both are overwritten by `data` on the vinyl file object (See "Use with `gulp-data`" below).

If you want to use a different version of pug, or define pug filters, you can pass your own instance of pug as the `pug` option:

```javascript
var pug = require('pug');
var gulpPug = require('gulp-pug');
var katex = require('katex');

pug.filters.katex = katex.renderToString;
pug.filters.shoutFilter = function (str) {
  return str + '!!!!';
}

gulp.task('pug', function () {
  return gulp.src('public/**/*.pug')
    .pipe(gulpPug({
      pug: pug,
      pretty: true
    }))
    .pipe(gulp.dest('public/'))
})
```

## Use with [gulp-data](https://www.npmjs.org/package/gulp-data)

The `gulp-data` plugin, is a standard method for piping data down-stream to other plugins that need data in the form of a new file property `file.data`. If you have data from a JSON file, front-matter, a database, or anything really, use `gulp-data` to pass that data to gulp-pug.

Retrieve data from a JSON file, keyed on file name:

```javascript
gulp.task('json-test', function() {
  return gulp.src('./examples/test1.pug')
    .pipe(data(function(file) {
      return require('./examples/' + path.basename(file.path) + '.json');
    }))
    .pipe(pug())
    .pipe(gulp.dest('build'));
});
```

Since gulp-data provides a callback, it means you can get data from a database query as well:

```javascript
gulp.task('db-test', function() {
  return gulp.src('./examples/test3.pug')
    .pipe(data(function(file, cb) {
      MongoClient.connect('mongodb://127.0.0.1:27017/gulp-data-test', function(err, db) {
        if(err) return cb(err);
        cb(undefined, db.collection('file-data-test').findOne({filename: path.basename(file.path)}));
      });
    }))
    .pipe(pug())
    .pipe(gulp.dest('build'));
});
```

If you want to use some static locals and some dynamic using gulp-data, the static locals will be overridden.
Instead, you can extend in the gulp-data function:

```javascript
var _ = require('lodash');

var statics = {
  my: 'statics',
  foo: 'bar'
};

gulp.task('json-test', function() {
  return gulp.src('./examples/test1.pug')
    .pipe(data(function(file) {
      var json = require('./examples/' + path.basename(file.path) + '.json');
      var data = _.assign({}, json, statics);
      return data;
    }))
    .pipe(pug())
    .pipe(gulp.dest('build'));
});
```

More info on [gulp-data](https://www.npmjs.org/package/gulp-data)

## AMD

If you are trying to wrap your Pug template functions in an AMD wrapper, use [`gulp-wrap-amd`](https://github.com/phated/gulp-wrap-amd)

```javascript
var pug = require('gulp-pug');
var wrap = require('gulp-wrap-amd');

gulp.task('templates', function() {
  gulp.src('./lib/*.pug')
    .pipe(pug({
      client: true
    }))
    .pipe(wrap({
      deps: ['pug'],
      params: ['pug']
    }))
    .pipe(gulp.dest('./dist/'))
});
```
## LICENSE

(MIT License)

Copyright (c) 2013 Blaine Bublitz

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
