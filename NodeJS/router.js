//router.js
function route (manejador, pathName, resp) {
	console.log("Nueva petición recibida: " + pathName);
	if (typeof manejador[pathName] === 'function') {
		manejador[pathName](resp);
	} else {
		console.log("404, " + pathName + " Not Found");
		resp.writeHead(404, {"Content-Type": "text/html"});
		resp.write("404, " + pathName + " Not Found");
		resp.end();
	}
}

exports.route = route;
