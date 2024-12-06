import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';




class Notification extends Model {
    public id!: number;
    public sender_id!: number;
    public receiver_id!: number;
    public message!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Notification.init(
    {
        id: {
            type: DataTypes.STRING,
            autoIncrement: true,
            primaryKey: true,
        },
        sender_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        receiver_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        
    },
    {
        sequelize,
        tableName: 'notifications',
        timestamps: true,
    }
);

export default Notification;