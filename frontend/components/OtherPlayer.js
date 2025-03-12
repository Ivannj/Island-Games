import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function OtherPlayer({ position, color }) {
    const ref = useRef();
//Movimientos mas fluidos de los demas jugadores
    useFrame(() => {
        if (ref.current) {

            //lerp() significa Linear Interpolation (Interpolación Lineal en español). Su función es suavizar la transición entre dos valores en un intervalo de tiempo, en lugar de hacer un cambio brusco e inmediato. Si no utilizamos Lerp veriamos cada 10 segundos un teletranporte en la posicion de los demas jugadores, porque utilizamos useFrame con setInterval en el player.js para los movimientos y actualizacion.
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