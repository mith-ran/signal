let currentContact = null;
const chatHistory = {}; // Stores messages per contact

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

  const messagesDiv = document.getElementById('messages');

  // Add user message
  const msgElem = document.createElement('div');
  msgElem.className = 'message sent';
  msgElem.innerHTML = `<span class="bubble">${message}</span>`;
  messagesDiv.appendChild(msgElem);

  // Save message to chatHistory
  chatHistory[currentContact] = chatHistory[currentContact] || [];
  chatHistory[currentContact].push({ text: message, sender: 'sent' });

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  input.value = '';

  // Simulate a response
  setTimeout(() => {
    const replyText = `${currentContact}: Got your message!`;

    const reply = document.createElement('div');
    reply.className = 'message received';
    reply.innerHTML = `<span class="bubble">${replyText}</span>`;
    messagesDiv.appendChild(reply);

    // Save reply to chatHistory
    chatHistory[currentContact].push({ text: replyText, sender: 'received' });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, 1000);
}

window.openChat = openChat;
window.sendMessage = sendMessage;
