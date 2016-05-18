var handler = require('./myserver/handler')
var server = require('http').createServer(handler.handler);
var io = require('socket.io')(server);
var fs = require('fs');
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port ' + port);
});

var numUsers = 0;
var users = {};

io.on('connection', function (socket, username) {
    console.log('a user conected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    // When someone writes a message
    socket.on('chat message', function(msg){
        //socket.broadcast.emit('chat message', msg);
        io.emit('chat message', msg);
    });

});