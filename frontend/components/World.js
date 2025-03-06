import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import Player from './Player';

export default function World() {
    return (
        <Canvas camera={{ position: [0, 10, 15], fov: 50 }}>
            {/* Luz */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} />

            {/* Cielo dinámico */}
            <Sky sunPosition={[100, 20, 100]} />

            {/* Suelo (la isla plana por ahora) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="lightgreen" />
            </mesh>

            {/*Renderizamos Player*/}
            <Player />

        </Canvas>
    );
}