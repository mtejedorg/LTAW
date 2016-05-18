var handler = require('./myserver/handler')
var server = require('http').createServer(handler.handler);
var io = require('socket.io')(server);
var fs = require('fs');
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port ' + port);
});

var numUsers = 0;

io.on('connection', function (socket) {
    var addedUser = false;

    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
        if (addedUser) {
            --numUsers;
            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });

    socket.on('add user', function (username) {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {numUsers: numUsers});
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'new message', this listens and executes
    socket.on('chat message', function (data) {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('chat message', {
            username: socket.username,
            message: data
        });
    });

});