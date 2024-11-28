import {Server} from 'socket.io'
import { httpServer } from '../index'

const io = new Server(httpServer,{
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"],
        credentials: true
        }
})