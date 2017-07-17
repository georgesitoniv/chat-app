const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../client');
const PORT = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected');

  socket.emit(
    'newMessage',
    generateMessage('Admin', 'Welcome to the Chat Room')
  );

  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New User has joined.')
  );

  socket.on('createMessage', (message) => {
    console.log("Create Message: ", message);
    io.emit(
      'newMessage',
      generateMessage(message.from, message.text)
    );
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // })
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
});

server.listen(PORT, () => console.log("Listening on port 3000"));
