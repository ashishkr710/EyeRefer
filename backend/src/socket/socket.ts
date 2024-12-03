import {Server} from 'socket.io'
import { joinRoom, sendMessage } from './event'

export let io:Server

export const setSocket = (httpServer:any) => {

    io = new Server(httpServer,{
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT"],
            credentials: true
            }
    })
   
    io.on('connection', (socket) => {
        console.log('Client connected');
        
        socket.on('joinchat', async(data:any)=>{
            joinRoom(socket, data);
        });

        socket.on('send_message', async(message:any) => {
            console.log(message);
            sendMessage(socket, message);
        });
        
        socket.on('disconnect', ()=>{
            console.log('Client disconnected');
        });
    });
}