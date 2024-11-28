import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import User from "./User";

class Staff extends Model {
  public uuid!: string;
  public staffName!: string;
//   public firstname!: string;
//   public lastname!: string;
  public gender!: string;
  public email!: string;
  public phone!: string;
}

Staff.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    staffName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
      // lastname: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // lastname: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId:{
      type: DataTypes.UUID,
      allowNull:false,
    }
  },
  {
    sequelize,
    modelName: 'Staff',
  }
);

User.hasMany(Staff, { foreignKey: 'referedby', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Staff.belongsTo(User, { foreignKey: 'referedby', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Staff;