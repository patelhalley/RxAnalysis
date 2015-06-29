/* External Modules */
var common = require('../../common/common');
var utility = require('../../common/utility');
var _und = require("underscore");

/* Export Module*/
module.exports = function (app) {

    app.get('/drug/label', function (request, response) {

        if (request.query.drug_name) {
            var searchTerms = request.query.drug_name.split(" ");
            var searchQueryString = "search=";
            for (var i = 0; i < searchTerms.length; i++) {
                searchQueryString += "openfda.brand_name:" + searchTerms[i];
                if (i < searchTerms.length - 1) {
                    searchQueryString += "+AND+";
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
                    return bn.toLowerCase() == parameter.drug_name.toLowerCase();
                });
            }
            return false;
        });
        
        _und.each(filteredLabel, function (fl) {
            if (fl.effective_time) {
                fl.effective_date = utility.get_date(fl.effective_time);
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

        parameter.response.send(JSON.stringify(_und.last(_und.sortBy(filteredLabel, function (fl) {
            return fl.effective_date;
        }))));
        return;
    }

    parameter.response.send({});
}