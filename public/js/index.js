const socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('newMessage', message);
    // create an ealement to list messages
    const li = jQuery('<li></li>');
    // list latest message
    li.text(`${message.from}: ${message.text}`);

    // insert element in the DOM
    jQuery('#messages').append(li);
});

// add callback to get ACK from the server
// socket.emit('createMessage', {
//     from: 'frank',
//     text: 'hi'
// }, function(data) {
//     console.log('Got it', data);
// });


// add event listener to the form
jQuery('#message-form').on('submit', function(e) {
    // over-ride page refresh
    e.preventDefault();

    // send the message in the form input field
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function() {

    });
});