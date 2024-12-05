import User from "../models/User";
import Chat from "../models/Chat";
import { io } from "./socket";
import Room from "../models/Room";
import { not } from "joi";

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

// export const sendNotification = async(notification: any) => {
//     try {
//         const user = await User.findOne({ where: { id: notification.userId } });

//         if (user) {
//             io.to(`user-${user.uuid}`).emit('notification', notification);
//         }
//     } catch (err) {
//         console.log(err);
//     }
// }

// export const getNotification = async(socket: any, userId: any) => {
//     try {
//         const user = await User.findOne({ where: { id: userId } });

//         if (user) {
//             socket.join(`user-${user.uuid}`);
//         }
//     } catch (err) {
//         console.log(err);
//     }
// }