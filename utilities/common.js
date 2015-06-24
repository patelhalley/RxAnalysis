var _und = require("underscore");
var utility = require('../utilities/utility');

module.exports = {
	getSuccess: function (data, response) {
		var returnData = new Object();
		returnData.results = [];

		if (data && data.results) {

			_und.each(data.results, function (item) {
				var d = new Date(Date.parse(item.time.substring(0, 4) + '-' + item.time.substring(4, 6) + '-' + item.time.substring(6)));
				var existingData = _und.find(returnData.results, function (r) {
					return r.label == (d.getFullYear() + ' ' + utility.getQuarter(d.getMonth()))
				});
				if (existingData) {
					existingData.value += item.count;
				} else {
					returnData.results.push(new groupData(d.getFullYear(), d.getMonth(), item.count));
				}
			});
		}
		response.setHeader('Content-Type', 'application/json');
		response.send(JSON.stringify(returnData));
	},
	getCategoryCountSuccess: function(data, response){
		response.setHeader('Content-Type', 'application/json');
		response.send(JSON.stringify(data));
	},

	groupData: function (label, value) {
		var self = this;
		self.label = label;
		self.value = value;
		return self;
	},
	getDate: function (stringDate) {
		return new Date(Date.parse(stringDate.substring(0, 4) + '-' + stringDate.substring(4, 6) + '-' + stringDate.substring(6)));
	}
};

var groupData = function (year, month, value) {
	var self = this;
	self.label = year + ' ' +utility.getQuarter(month);
	self.value = value;
	return self;
}

