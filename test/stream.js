'use strict';

var test = require('tap').test;

var task = require('../');

var es = require('event-stream');
var jade = require('jade');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');

var filePath = path.join(__dirname, 'fixtures', 'huge.jade');
var base = path.join(__dirname, 'fixtures');
var cwd = __dirname;

var file = new gutil.File({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.createReadStream(filePath)
});

test('should buffer the entire stream before compiling', function(t){
  var stream = task();
  stream.on('data', function(file){
    file.contents.pipe(es.wait(function(err, data){
      if(err){
        throw err;
      }
      t.equals(data, jade.renderFile(filePath), 'template should be compiled to html');
      t.end();
    }));
  });
  stream.write(file);
  stream.end();
});
