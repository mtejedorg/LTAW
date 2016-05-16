var http = require("http"),
    url = require("url"),
    logger = require("./logger");
    
function isform(request){
	var headers = request.headers;
	formContentTypes = {
		"application/x-www-form-urlencoded": "application/x-www-form-urlencoded",
		"multipart/form-data": "multipart/form-data"
	}
	contentType = headers["content-type"]
	if (formContentTypes[contentType]){
		return true;
	} else {
		return false;
	}
}

function proc(request, response, body){
	if (request.method.toLowerCase() == "post"){
		ans = ""
		bodyfields = body.split("&")
		for (sentence in bodyfields){
			ans += "El campo " + bodyfields[sentence].split("=")[0] + " tiene el valor: " 
				+ bodyfields[sentence].split("=")[1] + "<br>"
		}
		var headers = []
		headers["Content-Type"] = "text/html";
		response.writeHead(200, headers); 	// 200 OK, and just content-type atm
		response.write(ans); 		
		response.end(); 
	}
}
    
function form(request, response){
	var body = "";
	request.on('data', function(data) {
		body += data;
	}).on('end', function() {
		logger.log(request, body, "post");
		if(isform(request)){
			proc(request, response, body);
		}
	});
}

exports.form = form;
