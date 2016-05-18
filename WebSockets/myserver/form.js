var http = require("http"),
    url = require("url"),
    logger = require("./logger"),
    querystring = require('querystring');
    
function isform(request){
	var headers = request.headers;
	formContentTypes = {
		"application/x-www-form-urlencoded": "application/x-www-form-urlencoded",
		"multipart/form-data": "multipart/form-data"
	}
	contentType = headers["content-type"];
	referer = headers["referer"];
	
	/* Quick fix because i'm not getting content-type in a form GET request. */
	isGet = false;
	if (referer){
		isGet = referer.split("/")[3] == "form.html";
	}
	if (formContentTypes[contentType]||isGet){
		return true;
	} else {
		return false;
	}
}

function proc(request, response, bodyfields){
	var formfields = {}
	
	if (request.method.toLowerCase() == "post"){
		formfields = bodyfields;
	} else if (request.method.toLowerCase() == "get"){
		formfields = url.parse(request.url, true).query;
		console.log("formfields")
		console.log(formfields)
	}
	
	ans = ""
	for (field in formfields){
		ans += "El campo " + field + " tiene el valor: " + formfields[field] + "\r\n"
	}
	var headers = []
	headers["Content-Type"] = "text/plain";
	headers["Content-Length"] = Buffer.byteLength(ans);
	response.writeHead(200, headers);
	response.write(ans); 		
	response.end(); 
}
    
function form(request, response){
	var body = "";
	request.on('data', function(data) {
		body += data;
	}).on('end', function() {
		logger.log(request, body, "post");
		if(isform(request)){
			var parsedBody= querystring.parse(body)
			proc(request, response, parsedBody);
		}
	});
}

exports.form = form;
