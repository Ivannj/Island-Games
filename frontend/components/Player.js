import React, { useState, useEffect } from 'react';

export default function Player() {
    const [position, setPosition] = useState([0, 0.5, 0]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            setPosition(prev => {
                const [x, y, z] = prev;
                switch (e.key) {
                    case 'ArrowUp':    // Avanzar (hacia adelante en Z)
                        return [x, y, z - 0.5];
                    case 'ArrowDown':  // Retroceder
                        return [x, y, z + 0.5];
                    case 'ArrowLeft':  // Izquierda
                        return [x - 0.5, y, z];
                    case 'ArrowRight': // Derecha
                        return [x + 0.5, y, z];
                    default:
                        return prev; // No cambiar nada
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <mesh position={position}>
            <boxGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}