/* Excternal Modules */
var main = require('./main');
var _und = require("underscore");


/* Export module for exposing http end points*/
module.exports = function (app, application_cache) {

    app.get('/drugs', function (request, response) {
        response.setHeader('Content-Type', 'application/json');
        var cached_data = application_cache.get(main.cache_keys.drug_names);
        if (cached_data && request.query.search_term) {
            var return_data = _und.first(_und.filter(cached_data, function (item) {
                if (item && item.length > 0 && request.query.search_term) {
                    return item.toLowerCase().indexOf(request.query.search_term.toLowerCase()) == 0;
                } else {
                    return false;
                }
            }), 5);
            if (return_data) {
                response.send(JSON.stringify(return_data));
            } else {
                response.send({});
            }
        } else {
            main.cache_drug_names(application_cache);
            response.send({});
        }
    });
}