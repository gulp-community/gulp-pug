var es = require('event-stream'),
		compile = require('jade').compile;

module.exports = function(options) {
	'use strict';

	options = options || {};

	function jade(file, callback) {
		var compiled = compile(String(file.contents), options);
		var newFile = {
			path: file.path,
			contents: options.client ? compiled : compiled(options.data)
		};

		callback(null, newFile);
	}

	return es.map(jade);
};
