import { Sequelize } from "sequelize";
import { Local } from "../environment/env";

const DB_NAME:any = Local.DB_NAME
const DB_USER:any = Local.DB_USER
const DB_PASSWORD:any = Local.DB_PASSWORD
const DB_HOST:any = Local.DB_HOST
const DB_DIALECT:any = Local.DB_DIALECT

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host:DB_HOST,
    dialect: 'mysql',
    logging:false,
})

export default sequelize;