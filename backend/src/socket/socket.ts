import { Server } from 'socket.io';
import { getNotification, joinRoom, sendMessage, sendNotification } from './event';


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

    
    socket.on('send_notification', async (data: any) => {
      sendNotification(socket, data);
    });
    
    socket.on('get_notification', async (data: any) => {
      getNotification(socket, data);
    });

    socket.on('disconnect', () => {
    });
  });
};