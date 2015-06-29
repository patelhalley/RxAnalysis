module.exports = {

    get_full_month: function (mon) {
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
        var result = num.toString();
        if (result.length == 2) return result;
        else return '0' + result;
    },
    get_quarter: function (month) {
        var q = 'Q';
        if (month < 3) q += "1";
        else if (month < 6) q += "2";
        else if (month < 9) q += "3";
        else q += "4";
        return q;
    },
    get_date: function (string_date) {
        return new Date(Date.parse(string_date.substring(0, 4) + '-' + string_date.substring(4, 6) + '-' + string_date.substring(6)));
    }
};