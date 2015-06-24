var http = require('http');

module.exports = {

	getFullMonth: function (mon) {
		var month = new Array();
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";
		return month[mon];
	},
	get2DigitMonthDay: function (mon) {
		var result = mon.toString();
		if (result.length == 2) return result;
		else return '0' + result;
	},
	getQuarter: function (month) {
		var q = 'Q';
		if (month < 3) q += "1";
		else if (month < 6) q += "2";
		else if (month < 9) q += "3";
		else q += "4";
		return q;
	},
	makeRequest: function (host, path, method, response, success, applicationCache, cacheKey) {
		if (applicationCache) {
			var cachedData = applicationCache.get(cacheKey);

			if (cachedData) {
				success(cachedData, response);
				return;
			}
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
				buffer += chunk;
			});

			res.on('end', function (chunk) {
				data = JSON.parse(buffer);
				if (applicationCache) applicationCache.set(cacheKey, data);
				success(data, response);
			});
		});

		req.end();
	},
	makeNormalRequest: function (host, path, method, success, successParameter) {
		var options = {
			host: host,
			path: path,
			method: method
		};

		var req = http.request(options, function (res) {
			var buffer = "",
				data;
			res.on('data', function (chunk) {
				buffer += chunk;
			});

			res.on('end', function (chunk) {
				data = JSON.parse(buffer);
				success(data, successParameter);
			});
		});

		req.end();
	}
};