const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const cursoName = document.getElementById('curso-name');
const userList = document.getElementById('users');

// obtener nombre de usuario y sala de URL
const { usuario, curso } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// uniser a la  sala de chat
socket.emit('unirseChat', { usuario, curso });

// obtener usuarios de la sala
socket.on('salaUsers', ({ curso, users }) => {
  outputRoomName(curso);
  outputUsers(users);
});

// Mensaje del servidor
socket.on('mensaje', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll hacia abajo
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Enviar mensaje
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Obtener mensaje de texto
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emitir mensaje al servidor
  socket.emit('chatMensaje', msg);

  // limpiar input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});



// mensaje de salida al DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message','card','bg-info','mb-3');
  const p = document.createElement('p');
  p.classList.add('meta','mb-0','text-white');
  p.innerText = message.usuario;
  p.innerHTML += ` <span class="text-dark">${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text','mb-0');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Agregar nombre del curso DOM
function outputRoomName(curso) {
  cursoName.innerText = curso;
}

// agregar usuario al DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.usuario;
    userList.appendChild(li);
  });
}

//Avisar al usuario antes de abandonar la sala de chat
document.getElementById('abandonar-btn').addEventListener('click', () => {
  const abandonarSala = confirm('Estás seguro que quieres salir de la sala de chat de '+curso+'?');
  if (abandonarSala) {
    window.location = '../index.html';
  } else {
  }
});

if(curso==='JavaScript'){
  document.getElementById('chat-container').style.backgroundColor="yellow";
}
if(curso==='Node.js'){
  document.getElementById('chat-container').style.backgroundColor="green";
}
if(curso==='Python'){
  document.getElementById('chat-container').style.backgroundColor="blue";
}
if(curso==='PHP'){
  document.getElementById('chat-container').style.backgroundColor="purple";
}
if(curso==='C#'){
  document.getElementById('chat-container').style.backgroundColor="purple";
}
if(curso==='Ruby'){
  document.getElementById('chat-container').style.backgroundColor="red";
}
if(curso==='Java'){
  document.getElementById('chat-container').style.backgroundColor="gray";
}
