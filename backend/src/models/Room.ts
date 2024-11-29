import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import User from "./User";
import Patient from "./Patient";

class Room extends Model {
    public uuid!:string;
    public name!:string;
    public user_id_1!:string;
    public user_id_2!:string;
    public patient_id!: string
}

Room.init({
    uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull:false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    modelName:'Room',
    sequelize
})

User.hasMany(Room, { foreignKey: 'user_id_1', as:'doc1', onDelete:'CASCADE', onUpdate:'CASCADE' });
Room.belongsTo(User, { foreignKey: 'user_id_1', as:'doc1', onDelete:'CASCADE', onUpdate:'CASCADE' });

User.hasMany(Room, { foreignKey: 'user_id_2', as:'doc2', onDelete:'CASCADE', onUpdate:'CASCADE' });
Room.belongsTo(User, { foreignKey: 'user_id_2', as:'doc2', onDelete:'CASCADE', onUpdate:'CASCADE' });

Patient.hasMany(Room, { foreignKey:'patient_id', as:'patient', onDelete:'CASCADE', onUpdate:'CASCADE' });
Room.belongsTo(Patient, { foreignKey:'patient_id', as:'patient', onDelete:'CASCADE', onUpdate:'CASCADE' });

export default Room;