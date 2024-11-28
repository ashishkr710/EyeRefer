import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import User from "./User";
import Patient from "./Patient";

class Appointment extends Model {
  public uuid!: string;
  public type!: string;
  public date!: string;
  public patientId!: string;  // This will reference the Patient model
  public userId!: string;     // This will reference the User (Doctor or Optometrist)
  public createdAt!: Date;
  public updatedAt!: Date;
    patient: any;
    user: any;
    // status: string;
}

Appointment.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'uuid',
      },
    },
  },
  {
    sequelize,
    modelName: 'Appointment',
  }
);


User.hasMany(Appointment, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Appointment.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Patient.hasMany(Appointment, { foreignKey: 'patientId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Appointment;
