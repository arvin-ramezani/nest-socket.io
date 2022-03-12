const socket = io('http://localhost:3000');

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL (qs library)
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join chatroom
socket.emit('joinRoom', { username, room });

// Ger Room Users
socket.on('roomUsers', ({ room, users }) => {
  console.log(room, users);
  outputRoomName(room);
  outputUsers(users);
});

socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message Submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get Message Text
  const msg = e.target.elements.msg.value;

  // Emit Message To server
  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output Message To DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');

  div.innerHTML = `
      <p class="meta">${message.username}<span>${message.time}</span></p>
      <p class="text">${message.text}</p>
    `;

  chatMessages.appendChild(div);
}

// Add Room Name To DOM
function outputRoomName(room) {
  roomName.innerText = room;
  console.log(room);
}

// Add Users To DOM
function outputUsers(users) {
  console.log(users);
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join(' ')}
  `;
}
