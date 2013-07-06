var es = require('event-stream'),
		compile = require('jade').compile;

module.exports = function(options) {
	'use strict';

	options = options || {};

	function jade(file, callback) {
		var compiled = compile(String(file.contents), options);
		var result = options.client ? compiled.toString() : compiled(options.data);
		file.contents = new Buffer(result);

		callback(null, file);
	}

	return es.map(jade);
};
