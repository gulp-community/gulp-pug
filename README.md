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

## Options

All options supported by the [Jade API](http://jade-lang.com/api/) are supported

In addition, you can pass in a `locals` or `data` option that will be used as locals for your HTML compilation.  The `locals` option takes precedence over the `data` option.

You can also pass in a function in place of `locals` or `data`. This function can either return your template data or pass the template data into a callback function.

```javascript
var jade = require('gulp-jade');

gulp.task('templates', function() {
  var YOUR_LOCALS = function(filepath,cb){
	cb({"foo":"bar"});
  };

  gulp.src('./lib/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./dist/'))
});
```

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
