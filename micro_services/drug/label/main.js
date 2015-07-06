/* External Modules */
var common = require('../../common/common');
var utility = require('../../common/utility');
var _und = require("underscore");

/* Export Module*/
module.exports = function (app) {

	app.get('/drug/label', function (request, response) {

		if (request.query.drug_name) {
			var searchTerms = request.query.drug_name.split(" ");
			var searchQueryString = 'search=openfda.brand_name:"';
			for (var i = 0; i < searchTerms.length; i++) {
				searchQueryString += searchTerms[i];
				if (i < searchTerms.length - 1) {
					searchQueryString += "+";
				}
				else {
					searchQueryString += '"';
				}
			}

			common.send_http_request(common.hosts.fda, '/drug/label.json?limit=100&' + searchQueryString, common.http_methods.get, getLabelComplete, {
				response: response,
				drug_name: request.query.drug_name
			});
		}
	});
}

/* Helper functions*/

function enhanceContent(source, fieldName) {
	
	var searchMask = fieldName.replace(/_/g, ' ') + ' ';
	var regEx = new RegExp(searchMask, "ig");
	var replaceMask = "";
	if (Object.prototype.toString.call(source) === '[object Array]') {
		for (var i = 0; i < source.length; i++) {
			source[i] = source[i].replace(regEx, replaceMask).replace(/^\s+|\s+$/g, '');
		}
	} else if (typeof source === 'string') {
		source = source.replace(regEx, replaceMask).replace(/^\s+|\s+$/g, '');
	} else {
		source = source;
	}
	return source;
}

function getLabelComplete(data, parameter) {
	parameter.response.setHeader('Content-Type', 'application/json');
	var labelFields = [];
	if (data && data.results && data.results.length > 0) {
		var filteredLabel = [];
		if (parameter && parameter.generalSearch == null) {
			filteredLabel = _und.filter(data.results, function (l) {
				if (l.openfda && l.openfda.brand_name) {
					return _und.some(l.openfda.brand_name, function (bn) {
						return (bn.toLowerCase().indexOf(parameter.drug_name.toLowerCase())) > -1;
					});
				}
				return false;
			});
		} else {
			filteredLabel = data.results;
		}

		_und.each(filteredLabel, function (fl) {
			if (fl.effective_time) {
				fl.effective_date = utility.get_date(fl.effective_time);
			}
			
		});
		var labelContent = _und.last(_und.sortBy(filteredLabel, function (fl) {
			return fl.effective_date;
		}));

		_und.each(Object.keys(labelContent), function (key) {
			if (!(key == 'openfda' || key == 0 || key == 'set_id' || key == '@epoch' || key == 'version' || key == 'effective_time'))
				labelFields.push(new field(key, labelContent[key]));
		});
		parameter.response.send(JSON.stringify(labelFields));
		return;
	} else if (parameter && parameter.generalSearch == null) {
		var search_terms = parameter.drug_name.split(" ");
		var searchQueryString = "search=";
		for (var i = 0; i < search_terms.length; i++) {
			searchQueryString += search_terms[i];
			if (i < search_terms.length - 1) {
				searchQueryString += "+AND+";
			}
		}
		common.send_http_request(common.hosts.fda, '/drug/label.json?limit=100&' + searchQueryString, common.http_methods.get, getLabelComplete, {
			response: parameter.response,
			drug_name: parameter.drug_name,
			generalSearch: true
		});

		return;
	}

	parameter.response.send({});
}

function field(title, content) {
	var self = this;
	self.isHTML = false;
	self.isArray = false;
	self.title = title.replace(new RegExp('_', 'g'), ' ').toUpperCase();
	self.content = enhanceContent(content, title);

	if (Object.prototype.toString.call(self.content) === '[object Array]') {
		self.isHTML = self.content[0].substring(0, 1) == '<';
		self.isArray = true;
	} else if (typeof self.content === 'string') {
		self.isHTML = self.content.substring(0, 1) == '<';
	} 
	return self;
}