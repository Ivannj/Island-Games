import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function OtherPlayer({ position, color }) {
    const ref = useRef();
//Movimientos mas fluidos de los demas jugadores
    useFrame(() => {
        if (ref.current) {
            ref.current.position.lerp({ x: position[0], y: position[1], z: position[2] }, 0.2);
        }
    });

    return (
        //Renderizamos a los otros jugadores con su color
        <mesh ref={ref}>
            <boxGeometry />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}