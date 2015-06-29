/* External Modules */
var common = require('../../common/common');
var utility = require('../../common/utility');
var _und = require("underscore");

/* Export Module */
module.exports = function (app) {

	app.get('/drug/enforcement/count', function (request, response) {
		if (request.query.drug_name) {
			var today = new Date();
			var searchTerms = request.query.drug_name.split(" ");
			var searchQueryString = 'search=recall_initiation_date:[20120101+TO+' + today.getFullYear() + utility.get_two_digit_number(today.getMonth()) + utility.get_two_digit_number(today.getDate()) + ']+AND+';
			for (var i = 0; i < searchTerms.length; i++) {
				searchQueryString += searchTerms[i];
				if (i < searchTerms.length - 1) {
					searchQueryString += "+AND+";
				}
			}
			common.send_http_request(common.hosts.fda, '/drug/enforcement.json?count=recall_initiation_date&limit=1000&' + searchQueryString, common.http_methods.get, get_count_complete, response);
		}
	});

	app.get('/drug/enforcement/classification_count', function (request, response) {
		if (request.query.drug_name) {
			var today = new Date();
			var searchTerms = request.query.drug_name.split(" ");
			var searchQueryString = 'search=recall_initiation_date:[20120101+TO+' + today.getFullYear() + utility.get_two_digit_number(today.getMonth()) + utility.get_two_digit_number(today.getDate()) + ']+AND+';
			for (var i = 0; i < searchTerms.length; i++) {
				searchQueryString += searchTerms[i];
				if (i < searchTerms.length - 1) {
					searchQueryString += "+AND+";
				}
			}
			common.send_http_request(common.hosts.fda, '/drug/enforcement.json?count=classification&limit=1000&' + searchQueryString, common.http_methods.get, get_category_count_success, response);
		}
	});

	app.get('/drug/enforcement/status_count', function (request, response) {
		if (request.query.drug_name) {
			var today = new Date();
			var searchTerms = request.query.drug_name.split(" ");
			var searchQueryString = 'search=recall_initiation_date:[20120101+TO+' + today.getFullYear() + utility.get_two_digit_number(today.getMonth()) + utility.get_two_digit_number(today.getDate()) + ']+AND+';
			for (var i = 0; i < searchTerms.length; i++) {
				searchQueryString += searchTerms[i];
				if (i < searchTerms.length - 1) {
					searchQueryString += "+AND+";
				}
			}
			common.send_http_request(common.hosts.fda, '/drug/enforcement.json?count=status&limit=1000&' + searchQueryString, common.http_methods.get, get_category_count_success, response);
		}
	});
}

/* Helper Functions */
function get_count_complete(data, response) {
	var returnData = [];

	if (data && data.results) {

		_und.each(data.results, function (item) {
			var d = utility.get_date(item.time);
			var existingData = _und.find(returnData, function (r) {
				return r.label == (d.getFullYear() + ' ' + utility.get_quarter(d.getMonth()))
			});
			if (existingData) {
				existingData.value += item.count;
			} else {
				returnData.push(new group_data(d.getFullYear(), d.getMonth(), item.count));
			}
		});
	}
	response.setHeader('Content-Type', 'application/json');
	response.send(JSON.stringify(returnData));
}

var group_data = function (year, month, value) {
	var self = this;
	self.label = year + ' ' + utility.get_quarter(month);
	self.value = value;
	return self;
}

function get_category_count_success(data, response) {
	response.setHeader('Content-Type', 'application/json');
	response.send(JSON.stringify(data.results));
}