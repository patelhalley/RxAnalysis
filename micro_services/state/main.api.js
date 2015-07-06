/* External Modules */
var utility = require('../common/utility');

module.exports = function (app) {
	app.get('/states', function (request, response) {
		response.setHeader('Content-Type', 'application/json');
		response.send(utility.all_states());
	});
}