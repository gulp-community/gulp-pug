var expect = require('chai').expect;
var task = require('../');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');
 
var filePath = path.join(__dirname, "fixtures", "extends.jade");
var base = path.join(__dirname, "fixtures");
var cwd = __dirname;

var file = new gutil.File({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.readFileSync(filePath)
});

describe('gulp-jade', function () {
  "use strict";
  describe('extends', function () {
    it('should compile a jade template with an extends', function (done) {
      var stream = task();
      stream.on('error', done);
      stream.on('data', function (newFile) {
        expect(newFile).to.be.ok;
        expect(newFile.contents).to.be.ok;
        expect(newFile.contents.toString()).to.equal('<div><h1>Hello World</h1></div>');
        done();
      });
      stream.write(file);
    });
  });
});
