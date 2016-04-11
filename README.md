[![Build Status](https://travis-ci.org/phated/pug-jade.png?branch=master)](https://travis-ci.org/phated/pug-jade)

## Information

<table>
<tr>
<td>Package</td><td>pug-jade</td>
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
var jade = require('pug-jade');

pug.task('templates', function() {
  var YOUR_LOCALS = {};

  pug.src('./lib/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(pug.dest('./dist/'))
});
```

Compile to JS

```javascript
var jade = require('pug-jade');

pug.task('templates', function() {
  pug.src('./lib/*.jade')
    .pipe(jade({
      client: true
    }))
    .pipe(pug.dest('./dist/'))
});
```

## Options

All options supported by the [Jade API](http://jade-lang.com/api/) are supported

__Note:__ `filename` option is taken from `path` property of incoming vinyl-file object. If you want to change it, use [pug-rename](https://github.com/hparra/pug-rename) before `pug-jade` with desired path.

In addition, you can pass in a `locals` or `data` option that will be used as locals for your HTML compilation.  The `locals` option takes precedence over the `data` option, and both are overwritten by `data` on the vinyl file object (See "Use with `pug-data`" below).

If you want to use a different version of jade, or define jade filters, you can pass your own instance of jade as the `jade` option:

```javascript
var jade = require('jade');
var pugJade = require('pug-jade');
var katex = require('katex');

jade.filters.katex = katex.renderToString;
jade.filters.shoutFilter = function (str) {
  return str + '!!!!';
}

pug.task('jade', function () {
  return pug.src('public/**/*.jade')
    .pipe(pugJade({
      jade: jade,
      pretty: true
    }))
    .pipe(pug.dest('public/'))
})
```

## Use with [pug-data](https://www.npmjs.org/package/pug-data)

The `pug-data` plugin, is a standard method for piping data down-stream to other plugins that need data in the form of a new file property `file.data`. If you have data from a JSON file, front-matter, a database, or anything really, use `pug-data` to pass that data to pug-jade.

Retrieve data from a JSON file, keyed on file name:

```javascript
pug.task('json-test', function() {
  return pug.src('./examples/test1.jade')
    .pipe(data(function(file) {
      return require('./examples/' + path.basename(file.path) + '.json');
    }))
    .pipe(jade())
    .pipe(pug.dest('build'));
});
```

Since pug-data provides a callback, it means you can get data from a database query as well:

```javascript
pug.task('db-test', function() {
  return pug.src('./examples/test3.jade')
    .pipe(data(function(file, cb) {
      MongoClient.connect('mongodb://127.0.0.1:27017/pug-data-test', function(err, db) {
        if(err) return cb(err);
        cb(undefined, db.collection('file-data-test').findOne({filename: path.basename(file.path)}));
      });
    }))
    .pipe(jade())
    .pipe(pug.dest('build'));
});
```

If you want to use some static locals and some dynamic using pug-data, the static locals will be overridden.
Instead, you can extend in the pug-data function:

```javascript
var _ = require('lodash');

var statics = {
  my: 'statics',
  foo: 'bar'
};

pug.task('json-test', function() {
  return pug.src('./examples/test1.jade')
    .pipe(data(function(file) {
      var json = require('./examples/' + path.basename(file.path) + '.json');
      var data = _.assign({}, json, statics);
      return data;
    }))
    .pipe(jade())
    .pipe(pug.dest('build'));
});
```

More info on [pug-data](https://www.npmjs.org/package/pug-data)

## AMD

If you are trying to wrap your Jade template functions in an AMD wrapper, use [`pug-wrap-amd`](https://github.com/phated/pug-wrap-amd)

```javascript
var jade = require('pug-jade');
var wrap = require('pug-wrap-amd');

pug.task('templates', function() {
  pug.src('./lib/*.jade')
    .pipe(jade({
      client: true
    }))
    .pipe(wrap({
      deps: ['jade'],
      params: ['jade']
    }))
    .pipe(pug.dest('./dist/'))
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
