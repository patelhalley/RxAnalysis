/* Excternal Modules */
var common = require('../common/common');
var _und = require("underscore");
var fs = require('fs');
var mkdirp = require('mkdirp');






/* Helper fields/functions*/
var application_cache = {};
var cache_key = "drug_names";
var drug_names = [];


function get_medicine_list(page) {
    var cachedData = application_cache.get(cache_key);

    if (cachedData) {
        return;
    } else {
        fs.exists('/cached_data/drug_names.js', function (exists) {
            if (exists) {
                application_cache.set(cacheKey, JSON.parse(fs.readFileSync('/cached_data/drug_names.js', 'utf8')));
            } else {
                common.send_http_request(common.hosts.nlm, '/dailymed/services/v2/drugnames.json?page=' + page, common.http_methods.get, get_medicine_list_complete, null);
            }
        });
    }
}

function get_medicine_list_complete(response, success) {
    if (response && response.data) {
        _und.each(response.data, function (drug) {
            if (drug.drug_name && drug.drug_name.length > 0 && drug.drug_name.length < 40) {
                if (drug.drug_name.indexOf('(') == 0 && drug.drug_name.indexOf(')') == drug.drug_name.length - 1) {
                    drug.drug_name = drug.drug_name.substring(1, drug.drug_name.length - 1);
                }
                var dn = _und.some(drug_names, function (d) {
                    return d == drug.drug_name;
                });

                if (!dn) {
                    drug_names.push(drug.drug_name);
                }
            }
        });
        if (response && response.metadata.current_page && response.metadata.total_pages && response.metadata.current_page == 2 /* response.metadata.total_pages*/ ) {
            application_cache.set(cache_key, drug_names);
            cache_drug_names_complete();
        } else if (response) {
            get_medicine_list((response.metadata.current_page + 1));
        }
    }
}

function cache_drug_names_complete() {
    try {
        mkdirp('/cached_data', function (err) {
            if (err) {
                console.log('Directory Error');
                return console.log(err);
            }
            fs.writeFile("/cached_data/drug_names.js", JSON.stringify(drug_names),
                function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("Drug names cached successfully.");
                });
        });
    } catch (ex) {}
    console.log("Drug names cached successfully.");
}

/* Export module for exposing http end points*/
module.exports = {
    cache_drug_names: function (cache) {
        application_cache = cache;
        get_medicine_list(1);
    },
    cache_keys: {
        drug_names: cache_key
    }

}