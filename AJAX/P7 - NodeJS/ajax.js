var http = require("http"),
    url = require("url");

var database = ["mano", "manzana", "manto", "manicura", "manso",
                "cobrar", "cobertura", "cobra", "cob", "cobalto", "cobarde"]

function answer(request, response, parsedBody){
    var msg = parsedBody["message"],
        ans = "",
        j = 0,
        suggestions = {};

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(stringBuscada, posicion) {
            posicion = posicion || 0;
            return this.indexOf(stringBuscada, posicion) === posicion;
        };
    }

    for (var i in database){
        if(database[i].startsWith(msg)){
            j= parseInt(j)+1;
            suggestions["suggestion" + j] = database [i];
        }
    }
    suggestions = JSON.stringify(suggestions);
    ans += suggestions;

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(ans);
}

function proc(request, response, body){
    var parsedBody= JSON.parse(body)
    answer(request, response, parsedBody);
}

exports.answer = answer;
exports.proc = proc;
