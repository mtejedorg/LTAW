var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    media = require("./media"),
    form = require("./form"),
    ajax = require("./ajax"),
    logger = require("./logger"),
    port = process.argv[2] || 8000;

    http.createServer(function (request, response)
    {
    	var body = "";
        request.on('data', function(data) {
            body += data;
        }).on('end', function() {
            logger.log(request, body, "all");

		    form.form(request, response, body);
		
            var uri = url.parse(request.url).pathname,
                filename = path.join(process.cwd(), uri); 	//String join actual directory plus pathname

            var contentTypesByExtension = {
                '.html':    "text/html",
                '.css':     "text/css",
                '.js':      "text/javascript",
                ".txt":     "text/plain",
                ".jpg":     "image/jpeg",
                ".gif":     "image/gif",
                ".png":     "image/png",
                ".mp4":     "video/mp4",
                ".webm":    "video/webm",
                ".ogg":     "video/ogg",
                ".mp3":     "audio/mpeg",
                ".wma":     "audio/wma",
                ".js":      "application/javascript"
            };

            /* Checks if filename exists and launches callback with result */
            fs.exists(filename, function (exists)
            {
                if (!exists)
                {
                    response.writeHead(404, { "Content-Type": "text/plain" });
                    response.write("404 Not Found\n");
                    response.end();
                    return;
                }

                /* If no name is given, returns index.html */
                if (fs.statSync(filename).isDirectory()) filename += '/index.html';

                fs.readFile(filename, "binary", function (err, file)
                {
                    if (err)
                    {
                        response.writeHead(500, { "Content-Type": "text/plain" });
                        response.write(err + "\n");
                        response.end();
                        return;
                    }

                    var headers = {};

                    /* Turns .ext in type/ext */
                    var contentType = contentTypesByExtension[path.extname(filename)];

                    //If it's a video
                    if (contentType.split()[0] == "video" || contentType.split()[0] == "audio")
                    {
                        media.media(filename, request, response);
                    // If it is a xmlHttpRequest
                    } else if (request.headers['x-requested-with'] === 'XMLHttpRequest'){
                        ajax.proc(request, response, body);
                    } else

                    /* Only answers if extension is contemplated*/
                        if (contentType)
                        {
                            headers["Content-Type"] = contentType;
                            response.writeHead(200, headers); 	// 200 OK, and just content-type atm
                            response.write(file, "binary"); 		// Writes file in binary but the extension is well settled
                            response.end();
                        }
                });
            });
        });
    }).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
console.log();
console.log("Press Join in the index to test the form");
console.log();
console.log("Change 'post' in form.js line 55 to 'all' if you want more debug")
console.log();
console.log("Try with strings 'man' and 'cob'");
console.log();
console.log();

