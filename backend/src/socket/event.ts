// import { get, getN } from './event';
import User from "../models/User";
import Chat from "../models/Chat";
import { io } from "./socket";
import Room from "../models/Room";
import { not } from "joi";
import Notification from "../models/notification";

export const joinRoom = async(socket:any, data:any) => {
    try{
            const room = await Room.findOne({where:{ user_id_1:data.user1,
                user_id_2:data.user2, patient_id:data.patient }});

            if(room){
                socket.join(`room-${room.uuid}`);
                const chats = await Chat.findAll({where:{room_id:room.uuid}, include:[
                {
                    model:User,
                    as:'sender'
                },
                {
                    model:User,
                    as:'receiver'
                },
                {
                    model:Room,
                    as:'room'
                }],
                order:[['createdAt','ASC']]
            });

                if(chats){
                    io.to(`room-${room.uuid}`).emit('prev_msg', chats);
                    io.to(`room-${room?.uuid}`).emit('getRoom', room.uuid);
                } else {
                    io.to(`room-${room?.uuid}`).emit('getRoom', room.uuid);
                }
            } else {
                const newRoom = await Room.create({name:data.roomname, user_id_1:data.user1,
                    user_id_2:data.user2, patient_id:data.patient});

                socket.join(`room-${newRoom.uuid}`);
                io.to(`room-${newRoom?.uuid}`).emit('getRoom', newRoom.uuid);
            }
    }
    catch(err){
        console.log(err);
    }
}

export const sendMessage = async(socket:any, message:any) => {
    try{
            const chat = await Chat.create({message: message.message,
                room_id: message.room, sender_id: message.sender,
                receiver_id: message.receiver});

            io.to(`room-${message.room}`).emit('new_message', chat);
    }
    catch(err){
        console.log(err);
    }
}

// export const sendNotification = async(socket:any, data:any) => {
//     try{
//         const notification = await Notification.create({sender_id:data.sender_id,
//             receiver_id:data.receiver_id, message:data.message});
//         io.emit('new_notification', data);
//     }
//     catch(err){
//         console.log(err);
//     }
// }

export const sendNotification = async (socket: any, data: any) => {
    try {
      // Ensure sender_id and receiver_id are valid UUIDs
      const senderId = data.sender_id;
      const receiverId = data.receiver_id;
  
      if (!senderId || !receiverId) {
        throw new Error('Invalid sender_id or receiver_id');
      }
  
      const notification = await Notification.create({
        sender_id: senderId,
        receiver_id: receiverId,
        message: data.message,
      });
  
      io.emit('new_notification', data);
    } catch (err) {
      console.log(err);
    }
  };

  export const getNotification = async (socket: any, data: any) => {
    try {
      const notifications = await Notification.findAll({
        where: {
          receiver_id: data.receiver_id,
        },
      });
  
      io.to(socket.id).emit('get_notifications', notifications);
    } catch (err) {
      console.log(err);
    }
  }
