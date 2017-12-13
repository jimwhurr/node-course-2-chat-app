const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');

const PORT = process.env.PORT || 3000;
const app = express();

// get express to use our http server
const server = http.createServer(app);

// change server to use socket.io
const io = socketIO(server);

// initialise empty users list
const users = new Users();

// make static content available in the public folder
app.use(express.static(publicPath));

// catch socket connections
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and Room name are required');
        }

        // place user into the room
        socket.join(params.room);

        // remove them from any previous room
        users.removeUser(socket.id);

        // add them to the user list for the new room
        users.addUser(socket.id, params.name, params.room);

        // inform arrival to users in the room
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // socket.emit(); -- to one user
        socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {

        // get user record based on socket.id
        const user = users.getUser(socket.id);

        // if user exists and text is a string
        if (user && isRealString(message.text)) {
            // use io.emit to emit event to all connections!
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));       
        }

        // invoke callback to ackowledge the event (can take string as arg)
        callback();
    });

    socket.on('createLocationMessage', (coords) => {

        // get user record based on socket.id
        const user = users.getUser(socket.id);
        
        // if user exists and text is a string
        if (user) {
            // use io.emit to emit event to all connections!
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }        
    }); 
    
    socket.on('disconnect', () => {
        // remove and remember the user
        const user = users.removeUser(socket.id);
    
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));        
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server available on port ${PORT}. Press ^C to exit.`);
});
