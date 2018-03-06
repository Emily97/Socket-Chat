//server.js
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4000;
users = [];
connections = [];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  connections.push(socket);
  // console.log('Connected: %s sockets connected', connections.length);

  socket.on('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    // console.log('Disconnected: %s sockets connected', connections.length);
  });

    //send message
    socket.on('send message', function(data){
      // console.log(data);
      io.emit('new message', {msg: data, user: socket.username});
    });

    //new user
    socket.on('new user', function(data, callback){
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUsernames();
    });

    //typing
    socket.on('typing', function(data){
      socket.broadcast.emit('typing', data);
      // console.log(data);
    });

    function updateUsernames(){
      io.emit('get users', users);
    }
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
