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

// Función para generar colores aleatorios en formato hexadecimal
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Cuando un jugador se conecta
io.on('connection', (socket) => {
    console.log(' 🟢 Nuevo jugador conectado:', socket.id);

    // Asignamos un color aleatorio y una posición inicial
    players[socket.id] = { 
        x: 0, 
        y: 0.5, 
        z: 0, 
        color: getRandomColor() 
    };
    console.log(`🎨 Color asignado a ${socket.id}:`, players[socket.id].color);

    // Enviamos la lista de jugadores al nuevo jugador
    socket.emit('currentPlayers', players);
    console.log("📡 Enviando currentPlayers a:", socket.id, players);

    // Avisamos a los demás jugadores que alguien nuevo entró
    socket.broadcast.emit('playerJoined', { id: socket.id, color: players[socket.id].color });

    // Cuando el jugador se mueve, mantenemos su color
    socket.on('playerMove', (position) => {
        players[socket.id] = { ...players[socket.id], ...position };
        socket.broadcast.emit('updatePlayer', { id: socket.id, ...players[socket.id] });
    });

    //Listener test *************************************************************************************
    socket.on('requestPlayers', () => {
        console.log(`🔄 ${socket.id} ha solicitado la lista de jugadores.`);
        console.log("📡 Enviando currentPlayers desde el servidor:", players);
        socket.emit('currentPlayers', players);
    });

    // Cuando el jugador se desconecta, lo eliminamos y avisamos al resto de jugadores para que tambien dejen de verlo en sus pantallas. Desde World lo escuchamos y lo elminamos del frontend.
    socket.on('disconnect', () => {
        console.log('🔴 Jugador desconectado:', socket.id);
        delete players[socket.id];
        socket.broadcast.emit('removePlayer', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));