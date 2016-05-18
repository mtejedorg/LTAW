var http = require('http').createServer(handler);
var io = require('socket.io')(http);
var fs = require('fs');

http.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
    console.log('a user conected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
  //socket.emit('news', { hello: 'world' });
    socket.on('chat message', function(msg){
        //socket.broadcast.emit('chat message', msg);
        io.emit('chat message', msg);
    });
});