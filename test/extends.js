var expect = require('chai').expect;
var task = require('../');
var path = require('path');
var fs = require('fs');
 
var filePath = path.join(__dirname, "fixtures", "extends.jade");
var file = {
  path: filePath,
  shortened: 'extends.jade',
  contents: fs.readFileSync(filePath)
};

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
