var express = require('express');
var app = express();
var fs = require('fs');
var mkdirp = require('mkdirp');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var viewsDirectory = __dirname + '/public/views/'


var NodeCache = require("node-cache");
var applicationCache = new NodeCache({
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
require('./drug/open.fda.api')(app, applicationCache);


// Landing page / Home page
app.get('/', function (request, response) {
	response.sendFile(viewsDirectory + 'home.html');
});

app.get('/details', function (request, response) {
	response.sendFile(viewsDirectory + 'details.html');
});

var dailyMed = require('./drug/dailymed.nlm.nih.gov');
app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'))
		// Cache Drug names
	dailyMed.cacheDrugNames(applicationCache, 'drugNames', function () {
		console.log("Cache Completed");
		mkdirp('/cachedDrugNames', function (err) {
			if (err) {
				return console.log(err);
			}
			fs.writeFile("/cachedDrugNames/drug_names.js", JSON.stringify(applicationCache.get('drugNames')),
				function (err) {
					if (err) {
						return console.log(err);
					}
					console.log("The file was saved!");
				});
		});
	});
});