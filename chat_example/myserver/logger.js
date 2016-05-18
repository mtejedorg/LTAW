var http = require("http"),
    url = require("url");
    
function log(request, body, methods){
	method = request.method;
	if(methods.toLowerCase() == method.toLowerCase() || methods.toLowerCase() == "all"){
		console.log(">>> Method: " + method);
		url = request.url;
		console.log(">>> URL: " + url);
		version = request.httpVersion
		console.log(">>> HTTP version: " + version)
		
		console.log(">>> Headers:")
		headers = request.headers;
		for (header in headers) {
			str = "\t" + header + ":  " + headers[header]
			console.log(str)
		}

		console.log(">>> Body: " + body + "\r\n\r\n");
		console.log("\r\n\r\n");
	}
}

exports.log = log;
