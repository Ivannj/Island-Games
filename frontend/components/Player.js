import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Player() {
    const playerRef = useRef();

    const speed = 0.1; // velocidad de movimiento

    // Estados para controlar qué teclas están pulsadas
    const keysPressed = useRef({
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    });

    // Añadimos listeners al cargar (igual que antes), pero guardamos en keysPressed
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (keysPressed.current[e.key] !== undefined) {
                keysPressed.current[e.key] = true;
            }
        };

        const handleKeyUp = (e) => {
            if (keysPressed.current[e.key] !== undefined) {
                keysPressed.current[e.key] = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // useFrame = Se ejecuta cada frame (como Update() en Unity)
    useFrame(() => {
        if (!playerRef.current) return;

        let moveX = 0;
        let moveZ = 0;

        if (keysPressed.current.ArrowUp) moveZ -= speed;
        if (keysPressed.current.ArrowDown) moveZ += speed;
        if (keysPressed.current.ArrowLeft) moveX -= speed;
        if (keysPressed.current.ArrowRight) moveX += speed;

        playerRef.current.position.x += moveX;
        playerRef.current.position.z += moveZ;
    });

    return (
        <mesh ref={playerRef} position={[0, 0.5, 0]}>
            <boxGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}