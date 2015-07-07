var assert = require("assert")


//Unit Test For Utility
var utility = require('../micro_services/common/utility');
describe('Utility', function () {
	it('get_full_month should return full month when valid months from 0-11 are passed.', function () {
		assert.equal('January', utility.get_full_month(0));
		assert.equal(null, utility.get_full_month(-1));
		assert.equal(null, utility.get_full_month(12));
		assert.equal('July', utility.get_full_month(6));
	});

	it('get_two_digit_number should return 2 digit string when supplied numbers from 0-99.', function () {
		assert.equal('03', utility.get_two_digit_number(3));
		assert.equal(null, utility.get_two_digit_number(-6));
		assert.equal('12', utility.get_two_digit_number(12));
		assert.equal(null, utility.get_two_digit_number(-60));
		assert.equal(null, utility.get_two_digit_number(100));
	});

	it('get_quarter should return fiscal quarter when valid months from 0-11 supplied.', function () {
		assert.equal('Q1', utility.get_quarter(2));
		assert.equal('Q2', utility.get_quarter(5));
		assert.equal('Q4', utility.get_quarter(10));
		assert.equal(null, utility.get_quarter(12));
	});

	it('get_state_name return full state name for valid abbreviation.', function () {
		assert.equal('Arizona', utility.get_state_name('Az'));
		assert.equal('Alabama', utility.get_state_name('AL'));
		assert.equal(null, utility.get_state_name('Zz'));
	});

	it('get_date return valid date for FDA date format', function () {
		assert.equal(2015, utility.get_date('20150102').getFullYear());
		//0 = January -- 0 based month
		assert.equal(0, utility.get_date('20150105').getMonth());
		assert.equal(5, utility.get_date('20150105').getDate());
	});

});

//Unit Test For Utility
var common = require('../micro_services/common/common');
describe('Common', function () {
	var dataLength = 0;
	beforeEach(function (done) {
		common.send_http_request('api.fda.gov', '/drug/enforcement.json', common.http_methods.get, function (data, param) {
			dataLength = data.results.length;
			done();
		}, null);
	});

	it('send_http_request sends http request and fetches data in json format from api.fda.gov', function () {
		assert.equal(1, dataLength);
	});

});

//Unit Test for common drug api.
describe('Drug - Common', function () {
	this.timeout(5000);
	var dataLength = 0;
	beforeEach(function (done) {
		common.send_http_request('rxanalysis.herokuapp.com', '/drugs?search_term=a', common.http_methods.get, function (data, param) {
			dataLength = data.length;
			done();
		}, null);
	});

	it('/drugs should return 5 drugnames that starts with "a"', function () {
		assert.equal(5, dataLength);
	});

});

//Unit Test for drug label api.
describe('Drug - Label', function () {
	this.timeout(5000);
	var dataLength = 0;
	beforeEach(function (done) {
		common.send_http_request('rxanalysis.herokuapp.com', '/drug/label?drug_name=COLCRYS', common.http_methods.get, function (data, param) {
			dataLength = data.length;
			done();
		}, null);
	});

	it('/drug/label should return drug\'s label\'s fields having drug\'s brand name as COLCRYS', function () {
		assert.notEqual(0, dataLength);
	});
});


//Unit Test for drug event api.
describe('Drug - Event', function () {
	this.timeout(5000);
	var dataLength = 0;
	beforeEach(function (done) {
		common.send_http_request('rxanalysis.herokuapp.com', '/drug/event/count?drug_name=COLCRYS', common.http_methods.get, function (data, param) {
			dataLength = data.length;
			done();
		}, null);
	});

	it('/drug/event/count should return drug\'s event count by quarter for drug name COLCRYS', function () {
		assert.notEqual(0, dataLength);
	});
});

//Unit Test for drug event api.
describe('Drug - Enforcement', function () {
	this.timeout(5000);

	var enforcementCountDataLength = 0,
		classificationCountDataLength = 0,
		statusCountDataLength = 0;
	beforeEach(function (done) {
		common.send_http_request('rxanalysis.herokuapp.com', '/drug/enforcement/count?drug_name=AZITHROMYCIN&dp=Nationwide', common.http_methods.get, function (data, param) {
			enforcementCountDataLength = data.length;
			done();
		}, null);

	});
	beforeEach(function (done) {
		common.send_http_request('rxanalysis.herokuapp.com', '/drug/enforcement/classification_count?drug_name=AZITHROMYCIN&dp=Nationwide', common.http_methods.get, function (data, param) {
			classificationCountDataLength = data.length;
			done();
		}, null);
	});

	beforeEach(function (done) {
		common.send_http_request('rxanalysis.herokuapp.com', '/drug/enforcement/status_count?drug_name=AZITHROMYCIN&dp=Nationwide', common.http_methods.get, function (data, param) {
			statusCountDataLength = data.length;
			done();
		}, null);
	});


	it('/drug/enforcement/count should return drug\'s nationwide enforcement count by quarter for drug name AZITHROMYCIN', function () {
		assert.notEqual(0, enforcementCountDataLength);
	});


	it('/drug/enforcement/classification_count should return drug\'s nationwide enforcement count grouped by classification for drug name AZITHROMYCIN', function () {
		assert.notEqual(0, classificationCountDataLength);
	});


	it('/drug/enforcement/status_count should return drug\'s nationwide enforcement count grouped by status for drug name AZITHROMYCIN', function () {
		assert.notEqual(0, statusCountDataLength);
	});
});