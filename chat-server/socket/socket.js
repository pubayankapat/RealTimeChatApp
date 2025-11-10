import express from 'express';
import { Server } from 'socket.io';
import http from 'http';



const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['https://localhost:5173/'],
        methods: ["GET", "POST"],
        credential: true,
    },
});

export const getRecieverSocketId = (recieverId) => {
    return userSocketmap[recieverId];
}

const userSocketmap = {};
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId !== 'undefine') userSocketmap[userId] = socket.id;
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

export { app, io, server }