var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    media = require("./media"),
    port = process.argv[2] || 8888;

    http.createServer(function (request, response)
    {

        var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri); 	//String join actual directory plus pathname

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
            ".mp3":     "audio/mp3"
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

            /* If no name is given, returns index.html*/
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
                } else

                /* Only answers if extension is contemplated */
                    if (contentType)
                    {
                        headers["Content-Type"] = contentType;
                        response.writeHead(200, headers); 	// 200 OK, and just content-type atm
                        response.write(file, "binary"); 		// Writes file in binary but the extension is well settled
                        response.end();
                    }
            });
        });
    }).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
