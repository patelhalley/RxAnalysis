var utility = require('../utilities/utility');
var common = require('../utilities/common');
var _und = require("underscore");
var fs = require('fs');

module.exports = {
	cacheDrugNames: function (applicationCache, cacheKey, success) {
		getMedicineList(1, cacheDrugNamesComplete, cacheKey, applicationCache, success);
	}
}


var drugNames = [];

function getMedicineList(page, success, cacheKey, applicationCache, finalSuccess) {


	var cachedData = applicationCache.get(cacheKey);

	if (cachedData) {
		success(finalSuccess);
		return;
	} else {
		fs.exists('/cachedDrugNames/drug_names.js', function (exists) {
			if (exists) {
				applicationCache.set(cacheKey, JSON.parse(fs.readFileSync('/cachedDrugNames/drug_names.js', 'utf8')));
				success(finalSuccess);
				return;
			} else {
				console.log("Page: " + page);
				utility.makeNormalRequest('dailymed.nlm.nih.gov', '/dailymed/services/v2/drugnames.json?page=' + page, 'GET', getMedicineListComplete, {
					"success": success,
					"cacheKey": cacheKey,
					"applicationCache": applicationCache,
					"finalSuccess": finalSuccess
				});
			}
		});
	}
}

function getMedicineListComplete(data, parameters) {
	if (data && data.data) {
		_und.each(data.data, function (drug) {
			if (drug.drug_name && drug.drug_name.length > 0 && drug.drug_name.length < 40) {
				if (drug.drug_name.indexOf('(') == 0 && drug.drug_name.indexOf(')') == drug.drug_name.length - 1) {
					drug.drug_name = drug.drug_name.substring(1, drug.drug_name.length - 1);
				}
				var dn = _und.some(drugNames, function (d) {
					return d == drug.drug_name;
				});

				if (!dn) {
					drugNames.push(drug.drug_name);
				}
			}
		});
		if (data && data.metadata.current_page && data.metadata.total_pages && data.metadata.current_page == data.metadata.total_pages) {
			parameters.applicationCache.set(parameters.cacheKey, drugNames);
			parameters.success(parameters.finalSuccess);
		} else if (data) {
			getMedicineList((data.metadata.current_page + 1), parameters.success, parameters.cacheKey, parameters.applicationCache, parameters.finalSuccess);
		}
	}
}

function cacheDrugNamesComplete(finalSuccess) {
	finalSuccess();
}