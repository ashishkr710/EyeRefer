import express from 'express';
import cors from 'cors';
import { Local } from './environment/env';
import sequelize from './config/db';
import User from './models/User';
import userRouter from './routers/userRouter';
import {createServer} from 'http';
// import sequelize from 'seq';

const app = express();

export const httpServer = createServer(app);
   
app.use(cors());
app.use(express.json());
app.use("/", userRouter);
sequelize.sync({alter:false}).then(()=>{
    console.log('Database connected');
    
    httpServer.listen(Local.SERVER_PORT,  () => {
        console.log(`Server is running on port ${Local.SERVER_PORT}`);
        });
}).catch((err)=>{
    console.log("Error: ", err);
})