import { io } from 'https://cdn.socket.io/4.8.1/socket.io.esm.min.js';

let currentContact = null;
const chatHistory = {}; // Stores messages per contact
const socket = io(); // Connect to the backend server

console.log('Chat application initialized.');

// Open a chat with a contact
export function openChat(contactName) {
  currentContact = contactName;
  document.getElementById('chatWith').textContent = `Chat with ${contactName}`;
  document.getElementById('messages').innerHTML = '';

  // Load previous messages from chatHistory
  const messages = chatHistory[contactName] || [];
  for (const { text, sender } of messages) {
    const msgElem = document.createElement('div');
    msgElem.className = `message ${sender}`;
    msgElem.innerHTML = `<span class="bubble">${text}</span>`;
    document.getElementById('messages').appendChild(msgElem);
  }

  // Auto-scroll to bottom
  const messagesDiv = document.getElementById('messages');
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Send a message
export function sendMessage() {
  const input = document.getElementById('msgInput');
  const message = input.value.trim();

  if (!message || !currentContact) return;

  // Add user message to the UI
  const messagesDiv = document.getElementById('messages');
  const msgElem = document.createElement('div');
  msgElem.className = 'message sent';
  msgElem.innerHTML = `<span class="bubble">${message}</span>`;
  messagesDiv.appendChild(msgElem);

  // Save message to chatHistory
  chatHistory[currentContact] = chatHistory[currentContact] || [];
  chatHistory[currentContact].push({ text: message, sender: 'sent' });

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  input.value = '';

  // Send the message to the server
  socket.emit('sendMessage', { chatName: currentContact, message });
}

// Listen for incoming messages
socket.on('receiveMessage', ({ chatName, message, sender }) => {
  if (chatName === currentContact) {
    const messagesDiv = document.getElementById('messages');

    // Add the received message to the UI
    const msgElem = document.createElement('div');
    msgElem.className = 'message received';
    msgElem.innerHTML = `<span class="bubble">${message}</span>`;
    messagesDiv.appendChild(msgElem);

    // Save the message to chatHistory
    chatHistory[chatName] = chatHistory[chatName] || [];
    chatHistory[chatName].push({ text: message, sender: 'received' });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
});
