var es = require('event-stream');
var compile = require('jade').compile;
var clone = require('clone');

module.exports = function(options) {
	'use strict';

	var opts = options ? clone(options) : {};

	function jade(file, callback) {
		var newFile = clone(file);
		var compiled = compile(String(newFile.contents), opts);
		var result = opts.client ? compiled.toString() : compiled(opts.data);
		newFile.contents = new Buffer(result);

		callback(null, newFile);
	}

	return es.map(jade);
};
