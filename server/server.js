const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;
const app = express();

// get express to use our http server
const server = http.createServer(app);

// change server to use socket.io
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));

    socket.on('createMessage', (message, callback) => {

        // use io.emit to emit event to all connections!
        io.emit('newMessage', generateMessage(message.from, message.text));

        // invoke callback to ackowledge the event (can take string as arg)
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Jim', coords.latitude, coords.longitude));
    }); 
    
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server available on port ${PORT}. Press ^C to exit.`);
});
