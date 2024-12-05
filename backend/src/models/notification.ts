import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';




class Notification extends Model{
    public id!: number;
    public room_id!: number;
    public title!: string;
    public message!: string;
    public receiver_id!: number;    
    public userId!: number;
    // public read!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Notification.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'notifications',
        timestamps: true,
    }
);

export default Notification;