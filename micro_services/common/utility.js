var _und = require("underscore");

module.exports = {

	get_full_month: function (mon) {
		if (mon > 11 || mon < 0) return null;

		var month = new Array();
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";
		return month[mon];
	},
	get_two_digit_number: function (num) {
		if (!(typeof num === 'number')) return null;
		if (num < 0) return null;
		if (num > 99) return null;

		var result = num.toString();
		if (result.length == 2) return result;
		else return '0' + result;
	},
	get_quarter: function (month) {
		if (!(typeof month === 'number')) return null;
		if (month > 11 || month < 0) return null;
		var q = 'Q';
		if (month < 3) q += "1";
		else if (month < 6) q += "2";
		else if (month < 9) q += "3";
		else q += "4";
		return q;
	},
	get_date: function (string_date) {
		return new Date(Date.parse((Number(string_date.substring(0, 4))) + '-' + (Number(string_date.substring(4, 6))) + '-' + (Number(string_date.substring(6)))));
	},
	all_states: function () {
		return states;
	},
	get_state_name: function (abbr) {
		var state = _und.find(states, function (state) {
			return state.abbreviation.toUpperCase() == abbr.toUpperCase();
		});

		if (state) return state.name;
		else return null;
	}
};

var states = [
	{
		"name": "Nationwide",
		"abbreviation": "Nationwide"
    },
	{
		"name": "Alabama",
		"abbreviation": "AL"
    },
	{
		"name": "Alaska",
		"abbreviation": "AK"
    },
	{
		"name": "American Samoa",
		"abbreviation": "AS"
    },
	{
		"name": "Arizona",
		"abbreviation": "AZ"
    },
	{
		"name": "Arkansas",
		"abbreviation": "AR"
    },
	{
		"name": "California",
		"abbreviation": "CA"
    },
	{
		"name": "Colorado",
		"abbreviation": "CO"
    },
	{
		"name": "Connecticut",
		"abbreviation": "CT"
    },
	{
		"name": "Delaware",
		"abbreviation": "DE"
    },
	{
		"name": "District Of Columbia",
		"abbreviation": "DC"
    },
	{
		"name": "Federated States Of Micronesia",
		"abbreviation": "FM"
    },
	{
		"name": "Florida",
		"abbreviation": "FL"
    },
	{
		"name": "Georgia",
		"abbreviation": "GA"
    },
	{
		"name": "Guam",
		"abbreviation": "GU"
    },
	{
		"name": "Hawaii",
		"abbreviation": "HI"
    },
	{
		"name": "Idaho",
		"abbreviation": "ID"
    },
	{
		"name": "Illinois",
		"abbreviation": "IL"
    },
	{
		"name": "Indiana",
		"abbreviation": "IN"
    },
	{
		"name": "Iowa",
		"abbreviation": "IA"
    },
	{
		"name": "Kansas",
		"abbreviation": "KS"
    },
	{
		"name": "Kentucky",
		"abbreviation": "KY"
    },
	{
		"name": "Louisiana",
		"abbreviation": "LA"
    },
	{
		"name": "Maine",
		"abbreviation": "ME"
    },
	{
		"name": "Marshall Islands",
		"abbreviation": "MH"
    },
	{
		"name": "Maryland",
		"abbreviation": "MD"
    },
	{
		"name": "Massachusetts",
		"abbreviation": "MA"
    },
	{
		"name": "Michigan",
		"abbreviation": "MI"
    },
	{
		"name": "Minnesota",
		"abbreviation": "MN"
    },
	{
		"name": "Mississippi",
		"abbreviation": "MS"
    },
	{
		"name": "Missouri",
		"abbreviation": "MO"
    },
	{
		"name": "Montana",
		"abbreviation": "MT"
    },
	{
		"name": "Nebraska",
		"abbreviation": "NE"
    },
	{
		"name": "Nevada",
		"abbreviation": "NV"
    },
	{
		"name": "New Hampshire",
		"abbreviation": "NH"
    },
	{
		"name": "New Jersey",
		"abbreviation": "NJ"
    },
	{
		"name": "New Mexico",
		"abbreviation": "NM"
    },
	{
		"name": "New York",
		"abbreviation": "NY"
    },
	{
		"name": "North Carolina",
		"abbreviation": "NC"
    },
	{
		"name": "North Dakota",
		"abbreviation": "ND"
    },
	{
		"name": "Northern Mariana Islands",
		"abbreviation": "MP"
    },
	{
		"name": "Ohio",
		"abbreviation": "OH"
    },
	{
		"name": "Oklahoma",
		"abbreviation": "OK"
    },
	{
		"name": "Oregon",
		"abbreviation": "OR"
    },
	{
		"name": "Palau",
		"abbreviation": "PW"
    },
	{
		"name": "Pennsylvania",
		"abbreviation": "PA"
    },
	{
		"name": "Puerto Rico",
		"abbreviation": "PR"
    },
	{
		"name": "Rhode Island",
		"abbreviation": "RI"
    },
	{
		"name": "South Carolina",
		"abbreviation": "SC"
    },
	{
		"name": "South Dakota",
		"abbreviation": "SD"
    },
	{
		"name": "Tennessee",
		"abbreviation": "TN"
    },
	{
		"name": "Texas",
		"abbreviation": "TX"
    },
	{
		"name": "Utah",
		"abbreviation": "UT"
    },
	{
		"name": "Vermont",
		"abbreviation": "VT"
    },
	{
		"name": "Virgin Islands",
		"abbreviation": "VI"
    },
	{
		"name": "Virginia",
		"abbreviation": "VA"
    },
	{
		"name": "Washington",
		"abbreviation": "WA"
    },
	{
		"name": "West Virginia",
		"abbreviation": "WV"
    },
	{
		"name": "Wisconsin",
		"abbreviation": "WI"
    },
	{
		"name": "Wyoming",
		"abbreviation": "WY"
    }
];