var socket = io();

socket.on('newMessage', function(message){
  console.log('Got a new message', message);
  var li = $('<li></li>');
  li.text(message.from + ": " + message.text);
  $('#messages-list').append(li);
});

$('#message-form').submit(function(e){
  e.preventDefault();
  socket.emit('createMessage', {
    from: "User",
    text: $('input[name=message]').val()
  }, function() {
    console.log('Message Sent');
    $('input[name=message]').val('')
  });
});

$('#send').click(function() {
  console.log('click');
});
