import React from 'react';

export default function OtherPlayer({ position, color }) {
    return (
        <mesh position={position}>
            <boxGeometry />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}