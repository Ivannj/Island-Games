import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import socket from "../utils/socket";

export default function Player() {
  const playerRef = useRef(); // No causa re-render al cambiar la posición
  const [color, setColor] = useState(null);
  const speed = 0.1; // velocidad de movimiento

  const keysPressed = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  // Escuchar el color asignado por el servidor y asegurarse de actualizarlo correctamente
  useEffect(() => {
    console.log("📡 Player.js montado, esperando datos del servidor...");

    const handlePlayersUpdate = (players) => {
        console.log("📡 Recibidos jugadores en Player.js:", players);
        console.log(`🔎 Mi ID es: ${socket.id}`);

        if (players && players[socket.id]) {
            console.log(`🎨 Mi color asignado en Player.js: ${players[socket.id].color}`);
            setColor(players[socket.id].color);
        } else {
            console.log("⚠️ No encontré mi ID en la lista de jugadores.");
        }
    };

    socket.on('currentPlayers', handlePlayersUpdate);
    
    // Emitimos la petición solo después de que el socket esté conectado
    if (socket.connected) {
        console.log("🔄 Cliente conectado, solicitando lista de jugadores...");
        socket.emit("requestPlayers");
    } else {
        socket.on("connect", () => {
            console.log("🔄 Cliente reconectado, solicitando lista de jugadores...");
            socket.emit("requestPlayers");
        });
    }

    return () => {
        socket.off("currentPlayers", handlePlayersUpdate);
        socket.off("connect");
    };
  }, []);

  // Control de movimiento
  useEffect(() => {
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

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
//Movimiento de jugador con useFrame para que se actualize cada frame y hacerlo mas fluido el movimiento, en useEffect no tiene sentido porque no lo actuaizaria cada frame o cada cierto tiempo sino cuando react necesite renderizar, se veria lento, no tiene sentido utilizar useFrame.
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

// Enviamos al servidor menos peticiones  10 por segundo en vez de 60 (frame a frame)
useEffect(() => {
    const sendPosition = () => {
        if (playerRef.current) {
            socket.emit("playerMove", {
                x: playerRef.current.position.x,
                y: playerRef.current.position.y,
                z: playerRef.current.position.z
            });
        }
    };

    const interval = setInterval(sendPosition, 100); // Envía posición cada 100ms y no sobrecargamos al servidro con 60 peticiones por segundo como seria cada frame utilizando useFrame. 
    return () => clearInterval(interval); // Limpia el intervalo cuando se desmonta
}, []);

  return (
    <mesh ref={playerRef} position={[0, 0.5, 0]}>
      <boxGeometry />
      <meshStandardMaterial color={color || "gray"} />
    </mesh>
  );
}