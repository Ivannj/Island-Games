import { io } from "socket.io-client";

// No conectamos socket directamente, sino cuando nosotros digamos desde el frontend (index.js dentro del useEffect)
const socket = io("http://localhost:5000", { autoConnect: false });

export default socket;
