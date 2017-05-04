'use strict';

var objectAssign = require('object-assign');
var through = require('through2');
var defaultPug = require('pug');
var ext = require('gulp-util').replaceExtension;
var PluginError = require('gulp-util').PluginError;
var log = require('gulp-util').log;

// A function to make the namespace client templates are compiled to
function getNamespaceDeclaration(ns) {
  const output = [];
  let curPath = 'this';

  if (ns !== 'this') {
    var nsParts = ns.split('.');
    nsParts.forEach(function(curPart) {
      if (curPart !== 'this') {
        curPath += '[' + JSON.stringify(curPart) + ']';
        output.push(curPath + ' = ' + curPath + ' || {};');
      }
    });
  }

  return {
    namespace: curPath,
    declaration: output.join('\n')
  };
}

module.exports = function gulpPug(options) {
  var opts = objectAssign({}, options);
  var pug = opts.pug || opts.jade || defaultPug;

  opts.data = objectAssign(opts.data || {}, opts.locals || {});

  // filename conversion for templates
  var defaultProcessName = function(name) {
    return name.replace('.pug', '');
  };

  var processName = opts.processName || defaultProcessName;

  let nsInfo;
  if (opts.namespace) {
    nsInfo = getNamespaceDeclaration(opts.namespace);
  }

  return through.obj(function compilePug(file, enc, cb) {
    var data = objectAssign({}, opts.data, file.data || {});

    opts.filename = file.path;
    file.path = ext(file.path, opts.client ? '.js' : '.html');

    if (file.isStream()) {
      return cb(new PluginError('gulp-pug', 'Streaming not supported'));
    }

    if (file.isBuffer()) {
      try {
        var compiled;
        var contents = String(file.contents);

        let localFilePath = file.path.replace(process.cwd() + '/', '');
        let filename = processName(localFilePath);

        if (opts.verbose === true) {
          log('compiling file', file.path);
        }
        if (opts.client) {
          compiled = pug.compileClient(contents, opts);

          if (opts.namespace) {
            compiled = nsInfo.namespace + '[' + JSON.stringify(filename) +
              '] = ' + compiled;
          }
        } else {
          compiled = pug.compile(contents, opts)(data);
        }
        file.contents = new Buffer(compiled);
      } catch (e) {
        return cb(new PluginError('gulp-pug', e));
      }
    }
    cb(null, file);
  });
};
