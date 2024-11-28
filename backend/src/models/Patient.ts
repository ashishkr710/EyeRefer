import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import Address from "./Address";
import User from "./User";

class Patient extends Model {
    public uuid!: number;
    public firstname!: string;
    public lastname!: string;
    public gender!: string;
    public email!: string;
    public dob!: Date;
    public disease!: string;
    public referedby!: string;
    public referedto!: string;
    public referalstatus!: boolean;
    public referback!: boolean
    // public address!: string;
    public companyName!: string;
    public policyStartingDate!: Date;
    public policyExpireDate!: Date;
    public notes!: string;
    public phoneNumber!:string;
    public laterality!:string;
    public timing!:string;
    public speciality!:string;
    Address: any;
    Appointments: any;
    referedbyUser: any;
    referedtoUser: any;
}

Patient.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    disease: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    referalstatus: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    referback: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    policyStartingDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    policyExpireDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    phoneNumber:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    notes:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    laterality:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    timing:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    speciality:{
        type:DataTypes.STRING,
        allowNull:false,
    },
}, {
    sequelize,
    modelName: 'Patient'
})

User.hasMany(Patient, { foreignKey: 'referedby', as:'referedbyUser',onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'referedby', as:'referedbyUser', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

User.hasMany(Patient, { foreignKey: 'referedto', as:'referedtoUser', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'referedto', as:'referedtoUser', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Address.hasMany(Patient, { foreignKey: "address", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(Address, { foreignKey: "address", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Patient;