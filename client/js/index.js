var socket = io();
var locationButton = $('#btn-send-location');
var messageTextBox = $('input[name=message]');

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
    text: messageTextBox.val()
  }, function() {
    messageTextBox.val('')
  });
});

locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled');
  locationButton.text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled');
    locationButton.text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(){
    locationButton.removeAttr('disabled');
    ocationButton.text('Send Location');
    alert('Unable to fetch location.')
  });
});
