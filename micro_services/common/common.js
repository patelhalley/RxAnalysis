var http = require('http');

module.exports = {
	send_http_request: function (host, path, method, success_callback, success_parameter) {

		if (host == 'api.fda.gov') {
			if(path.indexOf('?') > 0)
				path += '&api_key=' + api_keys.fda;
			else 
				path += '?api_key=' + api_keys.fda;
		}
		var options = {
			host: host,
			path: path,
			method: method
		};

		var req = http.request(options, function (res) {
			var buffer = "",
				data;
			res.on('data', function (chunk) {
				try {
					buffer += chunk;
				} catch (ex) {
					console.log(ex);
					success_callback({}, success_parameter);
				}
			});

			res.on('end', function (chunk) {
				try {
					data = JSON.parse(buffer);
					success_callback(data, success_parameter);
				} catch (ex) {
					console.log(ex);
					success_callback({}, success_parameter);
				}
			});
		});

		req.end();
	},
	hosts: {
		fda: 'api.fda.gov',
		nlm: 'dailymed.nlm.nih.gov'
	},
	http_methods: {
		get: 'GET',
		post: 'POST'
	},
	api_keys: {
		fda: 'tAQVDFjqXCz7ghs2biffg6ZMkULC416zm2ufSJfL'
	}
};

var api_keys = {
	fda: 'tAQVDFjqXCz7ghs2biffg6ZMkULC416zm2ufSJfL'
};