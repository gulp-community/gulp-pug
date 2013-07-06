var gulp = require('gulp');
var expect = require('chai').expect;
var task = require('../');
var jade = require('jade');
var es = require('event-stream');
var path = require('path');
var fs = require('fs');


require('mocha');

describe('gulp-jade compilation', function(){

  'use strict';

  describe('gulp-jade', function(){

    var filename = path.join(__dirname, './fixtures/helloworld.jade');

    function expectStream(done, options){
      options = options || {};
      return es.map(function(file){
        var compiled = jade.compile(fs.readFileSync(filename), options);
        var expected = options.client ? compiled.toString() : compiled(options.data);
        expect(expected).to.equal(String(file.contents));
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

  });

});