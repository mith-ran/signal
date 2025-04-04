const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for messages from clients
  socket.on('sendMessage', ({ chatName, message }) => {
    console.log(`Message received in chat "${chatName}": ${message}`);

    // Broadcast the message to all users in the chat
    io.emit('receiveMessage', { chatName, message, sender: socket.id });
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});