const socket = io();

function scrollToBottom() {
    // Selectors
    const messages = jQuery('#messages');
    const newMessage = messages.children('li:last-child');

    // Heights
    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if ((clientHeight + scrollTop + newMessageHeight + lastMessageHeight) >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function() {
    const params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = "/";
        }
        else {
            console.log('No error');
        }
    });
});

socket.on('disconnect', function() {

});

socket.on('updateUserList', function(users) {
    const ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
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
    scrollToBottom();
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
    scrollToBottom();
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