var socket = io();

socket.on('newMessage', function(message){
  console.log('Got a new message', message);
  var li = $('<li></li>');
  li.text(message.from + ": " + message.text);
  $('#messages-list').append(li);
});

socket.on('newLocationMessage', function(message){
  var li = $('<li></li>');
  var a = $('<a target="_blank">My current location</a>');

  li.text(message.from + ": ");
  a.attr('href', message.url);
  li.append(a);
  $('#messages-list').append(li);
});

$('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage', {
    from: "User",
    text: $('input[name=message]').val()
  }, function() {
    console.log('Message Sent');
    $('input[name=message]').val('')
  });
});

var locationButton = $('#btn-send-location');

locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser.');
  }
  navigator.geolocation.getCurrentPosition(function(position){
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(){
    alert('Unable to fetch location.')
  });
});
