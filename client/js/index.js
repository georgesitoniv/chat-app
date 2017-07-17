var socket = io();

socket.on('connect', function(){

});

socket.on('disconnect', function(){

});

socket.on('newMessage', function(message){
  console.log('Got a new message', message);
});
