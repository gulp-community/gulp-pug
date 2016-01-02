'use strict';

const through = require('through2');
const defaultJade = require('jade');
const ext = require('gulp-util').replaceExtension;
const PluginError = require('gulp-util').PluginError;
const path = require('path');


function setPathName(_path, name) {
  var parsed = path.parse(_path);
  parsed.base = name;
  return path.format( parsed );
}
function getPathName(_path) {
  return path.parse(_path).base;
}

module.exports = function (options) {
  options = options || {};
  var jade = options.jade || defaultJade;
  var pages = options.pages || {};

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new PluginError('gulp-jade', 'Streaming not supported'));
    }

    if (file.isBuffer()) {
      options.filename = file.path;
      file.path = ext(file.path, options.client ? '.js' : '.html');
      var data = file.data || options.locals || options.data;

      try {
        if (options.client) {
          compileClient(this, file);
        } else {
          compile(this, file, data);
        }
      } catch (e) {
        return cb(new PluginError('gulp-jade', e));
      }

      cb();
    }
  });

  function compileClient(stream, file) {
    var compiled = jade.compileClient(String(file.contents), options);
    file.contents = new Buffer(compiled);
    stream.push( file );
  }

  function compile(stream, file, data) {
    var _pages = pages[getPathName(file.path)];
    var tpl = jade.compile(String(file.contents), options);

    if (_pages === undefined) {
      compileTemplate(tpl, data, file);
    } else {
      _pages.forEach((page, i) => {
        var pageFile = file.clone();
        pageFile.path = setPathName(pageFile.path, page);
        compileTemplate(tpl, data, pageFile, i);
      });
    }

    function compileTemplate(tpl, data, file, pageNum) {
      data._file = file;
      data._pageNum = pageNum;
      file.contents = new Buffer(tpl(data));
      stream.push(file);
    }

  }

};
