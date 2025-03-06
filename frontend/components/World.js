import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import socket from '../utils/socket';
import Player from './Player';
import OtherPlayer from './OtherPlayer';

export default function World() {
    const [players, setPlayers] = useState({});
    const [myId, setMyId] = useState(null); // <- Aquí guardamos nuestro propio ID

    useEffect(() => {
        const handleConnect = () => {
            setMyId(socket.id);  // Cuando conecta, guardamos nuestro socket.id
        };

        const handleUpdatePlayer = ({ id, x, y, z }) => {
            setPlayers(prev => ({
                ...prev,
                [id]: { position: [x, y, z] }
            }));
        };

        const handleRemovePlayer = (id) => {
            setPlayers(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        };

        const handlePlayerJoined = ({ id }) => {
            console.log(`🎉 Player ${id} se ha unido a la isla!`);
        };

        const handleCurrentPlayers = (currentPlayers) => {
            setPlayers(currentPlayers);
        };

        socket.on('connect', handleConnect);  // <- Escuchamos nuestra conexión
        socket.on('updatePlayer', handleUpdatePlayer);
        socket.on('removePlayer', handleRemovePlayer);
        socket.on('playerJoined', handlePlayerJoined);
        socket.on('currentPlayers', handleCurrentPlayers);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('updatePlayer', handleUpdatePlayer);
            socket.off('removePlayer', handleRemovePlayer);
            socket.off('playerJoined', handlePlayerJoined);
            socket.off('currentPlayers', handleCurrentPlayers);
        };
    }, []);

    return (
        
        <Canvas camera={{ position: [0, 10, 15], fov: 50 }}>
            {/* Renderizamos la isla y todos sus objetos, jugadores..etc*/}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            <Sky sunPosition={[100, 20, 100]} />

            {/* Suelo */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="lightgreen" />
            </mesh>

            {/* Tu propio player */}
            <Player />

            {/* Renderizamos a todos los demás jugadores (excluyendo al propio) */}
            {Object.entries(players).map(([id, playerData]) => (
                id !== myId && <OtherPlayer key={id} position={playerData.position} />
            ))}
        </Canvas>
    );
}