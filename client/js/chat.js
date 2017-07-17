var socket = io();
var locationButton = $('#btn-send-location');
var messageTextBox = $('input[name=message]');

function scrollToBottom(){
  var messagesList  = $('#messages-list');
  var newMessage = messagesList.children('li:last-child');

  var clientHeight = messagesList.prop('clientHeight');
  var scrollTop = messagesList.prop('scrollTop');
  var scrollHeight = messagesList.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop
    + newMessageHeight + lastMessageHeight >= scrollHeight){
      messagesList.scrollTop(scrollHeight);
  }

}

socket.on('connect', function(){
  var params = $.deparam(window.location.search);
  socket.emit('join', params, function(err){
    if(err){
      alert(err);
      window.location.href = "/";
    } else {
      console.log('no error');
    }
  });
});

socket.on('updateUserList', function(users){
  var ol = $('<ol></ol>');
  users.forEach(function(user){
    ol.append($('<li></li>').text(user));
  });
  $('#users').html(ol);
});

socket.on('newMessage', function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });
  $('#messages-list').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $("#location-message-template").html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  })
  $('#messages-list').append(html);
  scrollToBottom();
});

$('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage', {
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
    locationButton.text('Send Location');
    alert('Unable to fetch location.')
  });
});
