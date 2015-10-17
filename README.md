[![Build Status](https://travis-ci.org/phated/gulp-jade.png?branch=master)](https://travis-ci.org/phated/gulp-jade)

## Information

<table>
<tr>
<td>Package</td><td>gulp-jade</td>
</tr>
<tr>
<td>Description</td>
<td>Compile Jade templates</td>
</tr>
<tr>
<td>Node Version</td>
<td>≥ 0.10</td>
</tr>
</table>

## Usage

Compile to HTML

```javascript
var jade = require('gulp-jade');

gulp.task('templates', function() {
  var YOUR_LOCALS = {};

  gulp.src('./lib/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./dist/'))
});
```

Compile to JS

```javascript
var jade = require('gulp-jade');

gulp.task('templates', function() {
  gulp.src('./lib/*.jade')
    .pipe(jade({
      client: true
    }))
    .pipe(gulp.dest('./dist/'))
});
```

Compile to JS using another function name

```javascript
var path = require('path');
var jade = require('gulp-jade');

gulp.task('templates', function() {
  gulp.src('./lib/*.jade')
    .pipe(jade({
      client: true,
      callbackName: function (filepath) {
        return 'Template' + path.basename(filepath).replace('.js', '');
      }
    }))
    .pipe(gulp.dest('./dist/'))
});
```

## Options

All options supported by the [Jade API](http://jade-lang.com/api/) are supported

__Note:__ `filename` option is taken from `path` property of incoming vinyl-file object. If you want to change it, use [gulp-rename](https://github.com/hparra/gulp-rename) before `gulp-jade` with desired path.

In addition, you can pass in a `locals` or `data` option that will be used as locals for your HTML compilation.  The `locals` option takes precedence over the `data` option, and both are overwritten by `data` on the vinyl file object (See "Use with `gulp-data`" below).

If you want to use a different version of jade, or define jade filters, you can pass your own instance of jade as the `jade` option:

```javascript
var jade = require('jade');
var gulpJade = require('gulp-jade');
var katex = require('katex');

jade.filters.katex = katex.renderToString;
jade.filters.shoutFilter = function (str) {
  return str + '!!!!';
}

gulp.task('jade', function () {
  return gulp.src('public/**/*.jade')
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest('public/'))
})
```

## Use with [gulp-data](https://www.npmjs.org/package/gulp-data)

The `gulp-data` plugin, is a standard method for piping data down-stream to other plugins that need data in the form of a new file property `file.data`. If you have data from a JSON file, front-matter, a database, or anything really, use `gulp-data` to pass that data to gulp-jade.

Retrieve data from a JSON file, keyed on file name:

```javascript
gulp.task('json-test', function() {
  return gulp.src('./examples/test1.jade')
    .pipe(data(function(file) {
      return require('./examples/' + path.basename(file.path) + '.json');
    }))
    .pipe(jade())
    .pipe(gulp.dest('build'));
});
```

Since gulp-data provides a callback, it means you can get data from a database query as well:

```javascript
gulp.task('db-test', function() {
  return gulp.src('./examples/test3.jade')
    .pipe(data(function(file, cb) {
      MongoClient.connect('mongodb://127.0.0.1:27017/gulp-data-test', function(err, db) {
        if(err) return cb(err);
        cb(undefined, db.collection('file-data-test').findOne({filename: path.basename(file.path)}));
      });
    }))
    .pipe(jade())
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
  return gulp.src('./examples/test1.jade')
    .pipe(data(function(file) {
      var json = require('./examples/' + path.basename(file.path) + '.json');
      var data = _.assign({}, json, statics);
      return data;
    }))
    .pipe(jade())
    .pipe(gulp.dest('build'));
});
```

More info on [gulp-data](https://www.npmjs.org/package/gulp-data)

## AMD

If you are trying to wrap your Jade template functions in an AMD wrapper, use [`gulp-wrap-amd`](https://github.com/phated/gulp-wrap-amd)

```javascript
var jade = require('gulp-jade');
var wrap = require('gulp-wrap-amd');

gulp.task('templates', function() {
  gulp.src('./lib/*.jade')
    .pipe(jade({
      client: true
    }))
    .pipe(wrap({
      deps: ['jade'],
      params: ['jade']
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
