'use strict';

const through = require('through2');
const ext = require('gulp-util').replaceExtension;
const PluginError = require('gulp-util').PluginError;
const defaultJade = require('jade');


module.exports = function (options) {
    options = options || {};
    var jade = options.jade || defaultJade;

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

            try {
                if (options.client) {
                    compileClient.call(this, file);
                } else {
                    var data = file.data || options.locals || options.data;
                    compile.call(this, file, data);
                }
            } catch (e) {
                return cb(new PluginError('gulp-jade', e));
            }

            cb();
        }
    });

    function compileClient(file) {
        var template = jade.compileClient(String(file.contents), options);
        file.contents = new Buffer(template);
        this.push(file);
    }

    function compile(file, data) {
        var template = jade.compile(String(file.contents), options);
        var render = options.render || defaultRender;
        render.call(this, file, template, data);
    }

}

function defaultRender(file, template, data) {
    file.contents = new Buffer(template(data));
    this.push(file);
}
