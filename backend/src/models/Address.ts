    import { Model, DataTypes } from "sequelize";
    import sequelize from "../config/db";
    import { v4 as UUIDV4 } from "uuid";
    import User from "./User";


    class Address extends Model{
        delete() {
            throw new Error("Method not implemented.");
        }
        public uuid!: number;
        public title!: string;
        public street!: string;
        public district!: string;
        public city!: string;
        public state!: string;
        public phone!: string;
        public pincode!: number;
        public userId!: number;
    }

    Address.init({
        uuid:{
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        title:{
            type: DataTypes.STRING,
        },
        street: {
            type: DataTypes.STRING,
        },
        district: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        state:{
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        pincode: {
            type: DataTypes.INTEGER,
        },
        // userId:{
        //     type: DataTypes.STRING,
        //     allowNull:false,
        //     references:{
        //         model: "User",
        //         key: 'uuid'
        //     },
        //     onDelete: "CASCADE",
        //     onUpdate: "CASCADE"
        // }
    },{
        sequelize,
        modelName:'Address'
    })

    User.hasMany(Address, {foreignKey: "user"});
    Address.belongsTo(User, {foreignKey: "user"});

    export default Address;
