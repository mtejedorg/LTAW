//Servidor.js
function inicializar ( route, manejador) { //Pasamos el objeto route y el objeto manejador
	var server = require('http').createServer();
	var url = require('url');
	function control(petic, resp) {
		var pathName = url.parse(petic.url).pathname;
		console.log('Petición recibida'); //Texto que saldrá por consola
		route(manejador, pathName, resp); //Además de pathName, pasamos el manejador y resp
		resp.writeHead(200, {'content-type': 'text/plain'});
		resp.write('Peticion recibida en el servidor: ' + pathName);
		resp.end();
	}
	server.on('request', control).listen(8080);
	console.log('Servidor inicializado');
}

exports.inicializar = inicializar; //Exportamos la función
