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

socket.on('newLocationMessage', function (message) {
        var li = jQuery('<li></li>');
        var a = jQuery('<a target="_blank">My current location</a>');

        li.text(`${message.from}: `);
        a.attr('href', message.url);
        li.append(a);
        jQuery('#messages').append(li);
    });

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

// add click event listener to the send-location button
const locationButton = jQuery('#send-location');

// below is equiv to jQuery('#send-location').on(...)
locationButton.on('click', function () {
    if ( ! navigator.geolocation ) {
        return alert('Geolocation not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    },
    function () {
        alert('Unable to fetch location');
    });
});