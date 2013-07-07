var gulp = require('gulp');
var expect = require('chai').expect;
var task = require('../');
var jade = require('jade');
var es = require('event-stream');
var path = require('path');
var fs = require('fs');
var extname = require('path').extname;

require('mocha');

describe('gulp-jade compilation', function(){

  'use strict';

  describe('gulp-jade', function(){

    var filename = path.join(__dirname, './fixtures/helloworld.jade');

    function expectStream(done, options){
      options = options || {};
      var ext = options.client ? '.js' : '.html';
      return es.map(function(file){
        var compiled = jade.compile(fs.readFileSync(filename), options);
        var expected = options.client ? compiled.toString() : compiled(options.data);
        expect(expected).to.equal(String(file.contents));
        expect(extname(file.path)).to.equal(ext);
        expect(extname(file.shortened)).to.equal(ext);
        done();
      });
    }

    it('should compile my jade files into HTML', function(done){
      gulp.file(filename)
        .pipe(task())
        .pipe(expectStream(done));
    });

    it('should compile my jade files into HTML with data passed in', function(done){
      gulp.file(filename)
        .pipe(task({
          data: 'Yellow Curled'
        }))
        .pipe(expectStream(done, {
          data: 'Yellow Curled'
        }));
    });

    it('should compile my jade files into JS', function(done){
      gulp.file(filename)
        .pipe(task({
          client: true
        }))
        .pipe(expectStream(done, {
          client: true
        }));
    });

    it('should always return contents as buffer with client = true', function(done){
      gulp.file(filename)
        .pipe(task({
          client: true
        }))
        .pipe(es.map(function(file){
          expect(file.contents).to.be.instanceof(Buffer);
          done();
        }));
    });

    it('should always return contents as buffer with client = false', function(done){
      gulp.file(filename)
        .pipe(task())
        .pipe(es.map(function(file){
          expect(file.contents).to.be.instanceof(Buffer);
          done();
        }));
    });

  });

});