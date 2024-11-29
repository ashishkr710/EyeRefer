import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import User from "./User";
import Room from "./Room";


class Chat extends Model {
    public uuid!: string;
    public room_id!: string;
    public sender_id!: string;
    public receiver_id!: string;
    public message!: string;
}

Chat.init({
    uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize,
    modelName: 'Chat'
});

User.hasMany(Chat, { foreignKey: 'sender_id', as:'sender', onDelete:"CASCADE", onUpdate:"CASCADE" });
Chat.belongsTo(User, { foreignKey: 'sender_id', as:'sender', onDelete:"CASCADE", onUpdate:"CASCADE" });

User.hasMany(Chat, { foreignKey: 'receiver_id', as:'receiver', onDelete:"CASCADE", onUpdate:"CASCADE" });
Chat.belongsTo(User, { foreignKey: 'receiver_id', as:'receiver', onDelete:"CASCADE", onUpdate:"CASCADE" });

Room.hasMany(Chat, { foreignKey:'room_id', as:'room', onDelete:'CASCADE', onUpdate:'CASCADE' });
Chat.belongsTo(Room, { foreignKey:'room_id', as:'room', onDelete:'CASCADE', onUpdate:'CASCADE' });

export default Chat;