const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// Lista de jugadores conectados
const players = {};

// Cuando un player se conecta
io.on('connection', (socket) => {
    console.log(' 🟢 Nuevo jugador conectado:', socket.id);

    // Añadimos el player a la lista
    players[socket.id] = { x: 0, y: 0.5, z: 0 };

    // Enviamos al nuevo player la lista actual de jugadores
    socket.emit('currentPlayers', players);

    // Avisamos al resto que alguien ha entrado
    socket.broadcast.emit('playerJoined', { id: socket.id });

    // Si el player se mueve, avisamos al server a donde en todo momento
    socket.on('playerMove', (position) => {
        players[socket.id] = position;
        socket.broadcast.emit('updatePlayer', { id: socket.id, ...position });
    });

    // Cuando se desconecta, avisamos a todos
    socket.on('disconnect', () => {
        console.log('🔴 Jugador desconectado:', socket.id);
        delete players[socket.id];
        socket.broadcast.emit('removePlayer', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));