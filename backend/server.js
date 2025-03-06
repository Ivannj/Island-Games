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

// - Evento cuando se conecta alguien
io.on('connection', (socket) => {
    console.log('Nuevo jugador conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('Jugador desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
