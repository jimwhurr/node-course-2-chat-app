const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');

const {generateMessage} = require('./utils/message');
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

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat app',
        createdAt: Date.now()
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user joined',
        createdAt: Date.now()
    });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);

        // use io.emit to emit event to all connections!
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: Date.now()
        });

        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: Date.now()
        // });
    });
    
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server available on port ${PORT}. Press ^C to exit.`);
});
