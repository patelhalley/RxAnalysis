var utility = require('../utilities/utility');
var common = require('../utilities/common');
var _und = require("underscore");
var dailyMed = require('./dailymed.nlm.nih.gov');

module.exports = function (app, applicationCache) {
	app.get('/drug/pastYearEnforcement', function (request, response) {
		getPastYearEnforcement(request, response, applicationCache);
	});

	app.get('/drugs', function (request, response) {
		response.setHeader('Content-Type', 'application/json');
		var cacheKey = 'drugNames';
		var cachedData = applicationCache.get(cacheKey);
		if (cachedData && request.query.searchterm) {
			var returndata = _und.first(_und.filter(cachedData, function (item) {
				if (item && item.length > 0 && request.query.searchterm) {
					return item.toLowerCase().indexOf(request.query.searchterm.toLowerCase()) > -1;
				} else
					return false;
			}), 5);
			if (returndata)
				response.send(JSON.stringify(returndata));
			else
				response.send({});
		} else {
			dailyMed.cacheDrugNames(applicationCache, cacheKey, dummy = function () {});
			response.send({});
		}
	});

	app.get('/drug/label', function (request, response) {

		if (request.query.drugname) {
			var searchTerms = request.query.drugname.split(" ");
			var searchQueryString = "search=";
			for (var i = 0; i < searchTerms.length; i++) {
				searchQueryString += "openfda.brand_name:" + searchTerms[i];
				if (i < searchTerms.length - 1) {
					searchQueryString += "+AND+";
				}
			}

			utility.makeNormalRequest('api.fda.gov', '/drug/label.json?limit=100&' + searchQueryString, 'GET', getLabelComplete, {
				"response": response,
				"drugname": request.query.drugname
			});
		}
	});

	app.get('/drug/enforcementCount', function (request, response) {
		if (request.query.drugname) {
			var today = new Date();
			var searchTerms = request.query.drugname.split(" ");
			var searchQueryString = 'search=recall_initiation_date:[20120101+TO+' + today.getFullYear() + utility.get2DigitMonthDay(today.getMonth()) + utility.get2DigitMonthDay(today.getDate()) + ']+AND+';
			for (var i = 0; i < searchTerms.length; i++) {
				searchQueryString += searchTerms[i];
				if (i < searchTerms.length - 1) {
					searchQueryString += "+AND+";
				}
			}
			utility.makeRequest('api.fda.gov', '/drug/enforcement.json?count=recall_initiation_date&limit=1000&' + searchQueryString, 'GET', response, common.getSuccess, null, '');
		}
	});
	
	app.get('/drug/enforcementClassificationCount', function (request, response) {
		console.log('Inside')
		if (request.query.drugname) {
			var today = new Date();
			var searchTerms = request.query.drugname.split(" ");
			var searchQueryString = 'search=recall_initiation_date:[20120101+TO+' + today.getFullYear() + utility.get2DigitMonthDay(today.getMonth()) + utility.get2DigitMonthDay(today.getDate()) + ']+AND+';
			for (var i = 0; i < searchTerms.length; i++) {
				searchQueryString += searchTerms[i];
				if (i < searchTerms.length - 1) {
					searchQueryString += "+AND+";
				}
			}
			utility.makeRequest('api.fda.gov', '/drug/enforcement.json?count=classification&limit=1000&' + searchQueryString, 'GET', response, common.getCategoryCountSuccess, null, '');
		}
	});
	
	app.get('/drug/enforcementStatusCount', function (request, response) {
		if (request.query.drugname) {
			var today = new Date();
			var searchTerms = request.query.drugname.split(" ");
			var searchQueryString = 'search=recall_initiation_date:[20120101+TO+' + today.getFullYear() + utility.get2DigitMonthDay(today.getMonth()) + utility.get2DigitMonthDay(today.getDate()) + ']+AND+';
			for (var i = 0; i < searchTerms.length; i++) {
				searchQueryString += searchTerms[i];
				if (i < searchTerms.length - 1) {
					searchQueryString += "+AND+";
				}
			}
			utility.makeRequest('api.fda.gov', '/drug/enforcement.json?count=status&limit=1000&' + searchQueryString, 'GET', response, common.getCategoryCountSuccess, null, '');
		}
	});
	
	
	app.get('/drug/eventCount', function (request, response) {
		if (request.query.drugname) {
			var today = new Date();
			var searchTerms = request.query.drugname.split(" ");
			var searchQueryString = 'search=receivedate:[20120101+TO+' + today.getFullYear() + utility.get2DigitMonthDay(today.getMonth()) + utility.get2DigitMonthDay(today.getDate()) + ']+AND+';
			for (var i = 0; i < searchTerms.length; i++) {
				searchQueryString += searchTerms[i];
				if (i < searchTerms.length - 1) {
					searchQueryString += "+AND+";
				}
			}
			utility.makeRequest('api.fda.gov', '/drug/event.json?count=receivedate&limit=1000&' + searchQueryString, 'GET', response, common.getSuccess, null, '');
		}
	});

};

function enhanceContent(source, fieldName) {
	var searchMask = fieldName.replace(/_/g, ' ') + ' ';
	var regEx = new RegExp(searchMask, "ig");
	var replaceMask = "";
	for (var i = 0; i < source.length; i++) {
		source[i] = source[i].replace(regEx, replaceMask);
	}

	return source;
}

function getLabelComplete(data, parameter) {
	parameter.response.setHeader('Content-Type', 'application/json');

	if (data) {
		var filteredLabel = _und.filter(data.results, function (l) {
			if (l.openfda && l.openfda.brand_name) {
				return _und.some(l.openfda.brand_name, function (bn) {
					return bn.toLowerCase() == parameter.drugname.toLowerCase();
				});
			}
			return false;
		});

		_und.each(filteredLabel, function (fl) {
			if (fl.effective_time) {
				fl.effective_date = common.getDate(fl.effective_time);
			}


			if (fl.information_for_patients) {
				fl.information_for_patients = enhanceContent(fl.information_for_patients, 'information_for_patients');
			}

			if (fl.how_supplied) {
				fl.how_supplied = enhanceContent(fl.how_supplied, 'how_supplied');
			}

			if (fl.indications_and_usage) {
				fl.indications_and_usage = enhanceContent(fl.indications_and_usage, 'indications_and_usage');
			}

			if (fl.dosage_and_administration) {
				fl.dosage_and_administration = enhanceContent(fl.dosage_and_administration, 'dosage_and_administration');
			}

			if (fl.adverse_reactions) {
				fl.adverse_reactions = enhanceContent(fl.adverse_reactions, 'adverse_reactions');
			}

			if (fl.drug_interactions) {
				fl.drug_interactions = enhanceContent(fl.drug_interactions, 'drug_interactions');
			}

			if (fl.clinical_studies) {
				fl.clinical_studies = enhanceContent(fl.clinical_studies, 'clinical_studies');
			}

			if (fl.nursing_mothers) {
				fl.nursing_mothers = enhanceContent(fl.indications_and_usage, 'nursing_mothers');
			}

			if (fl.clinical_pharmacology) {
				fl.clinical_pharmacology = enhanceContent(fl.clinical_pharmacology, 'clinical_pharmacology');
			}

			if (fl.pediatric_use) {
				fl.pediatric_use = enhanceContent(fl.pediatric_use, 'pediatric_use');
			}

			if (fl.description) {
				fl.description = enhanceContent(fl.description, 'description');
			}

		});

		//		var returnValueWithHtml = JSON.stringify({
		//			"count": filteredLabel.length,
		//			"results": _und.last(_und.sortBy(filteredLabel, function (fl) {
		//				return fl.effective_date;
		//			}))
		//		});
		//
		//		var regex = /(<([^>]+)>)/ig;
		//		var returnValue = returnValueWithHtml.replace(regex, "");

		parameter.response.send(JSON.stringify(_und.last(_und.sortBy(filteredLabel, function (fl) {
			return fl.effective_date;
		}))));
		return;
	}

	parameter.response.send({});
}

function getPastYearEnforcement(request, response, applicationCache) {
	var today = new Date();
	utility.makeRequest('api.fda.gov',
		'/drug/enforcement.json?search=report_date:[' + (today.getFullYear() - 1) + utility.get2DigitMonthDay(today.getMonth()) + '01+TO+' + today.getFullYear() + utility.get2DigitMonthDay(today.getMonth()) + utility.get2DigitMonthDay(today.getDate()) + ']&count=report_date',
		'GET',
		response,
		common.getSuccess, applicationCache, 'drugPastYearEnforcement');
}