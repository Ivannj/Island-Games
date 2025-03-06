import React from 'react';

export default function OtherPlayer({ position }) {
    return (
        <mesh position={position}>
            <boxGeometry />
            <meshStandardMaterial color="blue" />
        </mesh>
    );
}