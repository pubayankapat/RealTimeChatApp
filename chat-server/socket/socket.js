import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "http://chatrix.chickenkiller.com", // production domain
            "http://localhost",                 // Docker / Nginx on port 80
            "http://localhost:5173"             // Vite dev server
        ],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
// In-memory map to store connected user 
const userSocketmap = {};

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    // Store socket only when we actually have a valid userId
    if (userId && userId !== 'undefined') {
        userSocketmap[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(userSocketmap))

    // Join Group Room
    socket.on("joinGroup", (groupId) => {
        socket.join(groupId);
        console.log(`User joined group: ${groupId}`);
    });

    socket.on('disconnect', () => {
        delete userSocketmap[userId],
            io.emit('getOnlineUsers', Object.keys(userSocketmap));
    });
});

export const getRecieverSocketId = (recieverId) => {
    return userSocketmap[recieverId];
}



export { app, io, server }