//manejador.js
function funcion_1 (resp) {
console.log("Funcion 1 ejecutada.");
resp.writeHead(200, {"Content-Type": "text/html"});
resp.write("Funcion 1 ejecutada.");
resp.end();
}
function funcion_2 (resp) {
console.log("Funcion 2 ejecutada.");
resp.writeHead(200, {"Content-Type": "text/html"});
resp.write("Funcion 2 ejecutada.");
resp.end();
}
 
exports.funcion_1 = funcion_1;
exports.funcion_2 = funcion_2;
