var http = require(’http’);

http.createServer(function(request, response) {
    var headers = request.headers;
    var method = request.method;
    var url = request.url;
    var body = [];

    request.on("error", function(err) {
        console.error(err);
    }).on("data", function(chunk) {
    body.push(chunk);
    }).on("end", function() {
    body = Buffer.concat(body).toString();
    });

}).listen(8080);

response.on("error", function(err) {
    console.error(err);
});

response.statusCode = 200;
response.setHeader("Content-Type", "application/json");

var responseBody = {
    headers: headers,
    method: method,
    url: url,
    body: body
};

response.write(JSON.stringify(responseBody));
response.end();