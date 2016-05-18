var http = require('http'),
    querystring = require('querystring'),
    url = require('url');

var prices = {
    "brian": "10",
    "chaplin": "10",
    "dream": "15",
    "ebooks": "10",
    "fanpacks": "150",
    "lebowsky": "10",
    "megadeth": "10",
    "oldbooks": "100",
    "orbeaalma": "199",
    "orbeagrow": "150",
    "orbeakatu": "299",
    "orbeaorca": "399",
    "pinkfloyd": "30",
    "pulp": "10",
    "schoolbooks": "50",
    "antigua": "10"
}

function randomId(maxlength)
{
    var userid = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    var length = Math.floor(Math.random()*maxlength)
    for( var i=0; i < length; i++ )
        userid += possible.charAt(Math.floor(Math.random() * possible.length));

    return userid;
}

function parseCookies (request) {
    var cookiesRaw = request.headers.cookie;
    var cookies = querystring.parse(cookiesRaw, "; ", "=");

    return cookies;
}

function procOrder(request, response){
    var cookies = parseCookies(request);
    var actUserId = cookies["userid"];
	var ans = '';
	var price = 0;
	for (cookie in cookies){
	    if(cookies[cookie] == "alive"){
	        ans += 'Has comprado "' + cookie + '" por ' + prices[cookie] + "$\r\n";
	        price = parseInt(price) + parseInt(prices[cookie]);
	    }
	}
	ans += "Total: " + price + "$\r\n";
    var headers = []
    headers["Content-Type"] = "text/plain";
    headers["Content-Length"] = Buffer.byteLength(ans);
    response.writeHead(200, headers);
    response.write(ans);
    response.end();
}

function insertInitialCookie(request, headers){
    var setCookie = {};

    var actUserCookies = parseCookies(request)
    if (!actUserCookies["userid"]){
        var usrId = randomId(20);
        setCookie["userid"] = usrId;
    }

    setCookie["Path"] = "/";     //url.parse(request.url).pathname //Would return index
    setCookie["Expires"] = new Date(new Date().getTime()+86409000);
    var setCookies = querystring.stringify(setCookie, "; ", "=");
    headers["Set-Cookie"] = setCookies;
}

exports.insertInitialCookie = insertInitialCookie;
exports.procOrder = procOrder;