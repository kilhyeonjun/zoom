const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');
const nameForm = document.querySelector('#name');

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('#msg input');
  const value = input.value;
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = '';
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nameForm.querySelector('input');
  socket.emit('nickname', input.value, () => {
    nameForm.style.display = 'none';
  });
}
nameForm.addEventListener('submit', handleNicknameSubmit);

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector('#msg');
  msgForm.addEventListener('submit', handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
  roomName = input.value;
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (user) => {
  addMessage(`${user} arrived!`);
});

socket.on('bye', (left) => {
  addMessage(`${left} left ㅠㅠ`);
});

socket.on('new_message', addMessage);

socket.on('room_change', (rooms) => {
  const roomList = welcome.querySelector('ul');
  roomList.innerHTML = '';
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement('li');
    li.innerText = room;
    roomList.append(li);
  });
});
