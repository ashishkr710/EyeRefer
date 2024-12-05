import { Server } from 'socket.io';
import { joinRoom, sendMessage } from './event';
import Notification from '../models/notification'; // Import your Notification model

export let io: Server;

export const setSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {

    socket.on('joinchat', async (data: any) => {
      joinRoom(socket, data);
    });

    socket.on('send_message', async (message: any) => {
      sendMessage(socket, message);
    });

    socket.on('joinnotification', (data) => {
      socket.join(data?.id);
    });

    socket.on('sendNotification', async (data) => {
      io.to(data.room).emit("notification", { message: data.message });
      await Notification.create({
        message: data.message,
        receiver_id: parseInt(data.room),
        room_id: data.room,
      });
    });

    socket.on('disconnect', () => {
    });
  });
};