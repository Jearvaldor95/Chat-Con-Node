const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
require("dotenv").config();

const {
  userUnirseChat,
  getUsuarioActual,
  userAbandonaChat,
  getUsariosSala,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// establecer carpeta estatica
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chat Curso";

// Ejecutar cuando el cliente se conecta
io.on("connection", (socket) => {
  console.log("Cliente conectado");
  console.log(io.of("/").adapter);
  socket.on("unirseChat", ({ usuario, curso }) => {
    const user = userUnirseChat(socket.id, usuario, curso);

    socket.join(user.curso);

    // mensaje de bienvenida al usuario que se conecta
    socket.emit("mensaje", formatMessage(botName, "Bienvenido al chat del curso "+curso));

    // Emision cuando el usuario se conecta
    socket.broadcast
      .to(user.curso)
      .emit(
        "mensaje",
        formatMessage(botName, `${user.usuario} Se a unido al chat`)
      );

    // Enviar usuario e informacion de sala de chat
    io.to(user.curso).emit("salaUsers", {
      curso: user.curso,
      users: getUsariosSala(user.curso),
    });
  });

  // Escucar el mensaje de chat
  socket.on("chatMensaje", (msg) => {
    const user = getUsuarioActual(socket.id);

    io.to(user.curso).emit("mensaje", formatMessage(user.usuario, msg));
  });

  // Se ejecuta cuando el cliente se desconecta
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
    const user = userAbandonaChat(socket.id);

    if (user) {
      io.to(user.curso).emit(
        "mensaje",
        formatMessage(botName, `${user.usuario} ha salido del chat`)
      );

      // Enviar usuarios e informacion de sala de chat
      io.to(user.curso).emit("salaUsers", {
        curso: user.curso,
        users: getUsariosSala(user.curso),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
