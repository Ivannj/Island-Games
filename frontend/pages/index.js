import React, { useEffect } from 'react';
import socket from '../utils/socket';
import World from '../components/World';

export default function Home() {

    useEffect(() => {
        console.log('📡 Conectando al servidor...');

        // Conectamos manualmente socket en vez de conectarlo al iniciar la pagina (IMPORTANTE!! para no duplicar jugadores conectados porque si no lo metemos dentro del useEffect y desactivamos la autconexon en el script socket.js, se conecta al inciiar lapagina y al iniciar el useEffect)
        socket.connect();

        const handleConnect = () => {
            console.log('✅ Conectado al servidor con ID:', socket.id);
        };

        socket.on('connect', handleConnect);

        return () => {
            socket.off('connect', handleConnect);
            socket.disconnect();
        };
    }, []);

    return (
        <main className="w-screen h-screen">
            <World />
        </main>
    );
}