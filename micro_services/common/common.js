var http = require('http');

module.exports = {
    send_http_request: function (host, path, method, success_callback, success_parameter) {
        var options = {
            host: host,
            path: path,
            method: method
        };

        var req = http.request(options, function (res) {
            var buffer = "",
                data;
            res.on('data', function (chunk) {
                buffer += chunk;
            });

            res.on('end', function (chunk) {
                data = JSON.parse(buffer);
                success_callback(data, success_parameter);
            });
        });

        req.end();
    },
    hosts: {
        fda: 'api.fda.gov',
        nlm: 'dailymed.nlm.nih.gov'
    },
    http_methods: {
        get: 'GET',
        post: 'POST'
    }
};