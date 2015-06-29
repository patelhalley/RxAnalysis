var express = require('express');
var app = express();
var fs = require('fs');
var mkdirp = require('mkdirp');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var viewsDirectory = __dirname + '/public/views/'


var NodeCache = require("node-cache");
var application_cache = new NodeCache({
	stdTTL: 259200, // 24 Hours
	checkperiod: 120
});

// convert all querystring params to lower case
app.use(function (req, res, next) {
	for (var key in req.query) {
		req.query[key.toLowerCase()] = req.query[key];
	}
	next();
});

//Routes
require('./micro_services/drug/label/main')(app);
require('./micro_services/drug/enforcement/main')(app);
require('./micro_services/drug/event/main')(app);
require('./micro_services/drug/main.api')(app, application_cache);

var main = require('./micro_services/drug/main');
// Landing page / Home page
app.get('/', function (request, response) {
	response.sendFile(viewsDirectory + 'home.html');
});

app.get('/details', function (request, response) {
	response.sendFile(viewsDirectory + 'details.html');
});

app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'))
	main.cache_drug_names(application_cache);
});