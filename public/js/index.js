const socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    const timestamp = moment(message.CreatedAt).format('h:mm a');
    const template = jQuery('#message-template').html();
    const html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: timestamp
    });

    jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function (message) {
    const timestamp = moment(message.CreatedAt).format('h:mm a');
    const template = jQuery('#location-message-template').html();
    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: timestamp
    });

    jQuery('#messages').append(html);
});

// add event listener to the form
jQuery('#message-form').on('submit', function(e) {
    // over-ride page refresh
    e.preventDefault();

    const messageTextBox = jQuery('[name=message]');

    // send the message in the form input field
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function() {
        // clear previous message
        messageTextBox.val('');
    });
});

// add click event listener to the send-location button
const locationButton = jQuery('#send-location');

// below is equiv to jQuery('#send-location').on(...)
locationButton.on('click', function () {
    if ( ! navigator.geolocation ) {
        return alert('Geolocation not supported by your browser');
    }

    // grey out button while waiting for geolocate to finish
    locationButton.attr('disabled', 'disabled').text('Sening location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        // re-enable the button
        locationButton.removeAttr('disabled').text('Send location');

        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    },
    function () {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});