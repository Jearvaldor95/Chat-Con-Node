const usuarios = [];

// Unirse el usuario al chat
function userUnirseChat(id, usuario, curso) {
  const user = { id, usuario, curso };

  usuarios.push(user);

  return user;
}

// Obtener usuario actual
function getUsuarioActual(id) {
  return usuarios.find(user => user.id === id);
}

// Cuando el usuario deja el chat
function userAbandonaChat(id) {
  const index = usuarios.findIndex(user => user.id === id);

  if (index !== -1) {
    return usuarios.splice(index, 1)[0];
  }
}

// Obtener usuario de sala
function getUsariosSala(curso) {
  return usuarios.filter(user => user.curso === curso);
}

module.exports = {
  userUnirseChat,
  getUsuarioActual,
  userAbandonaChat,
  getUsariosSala
};
