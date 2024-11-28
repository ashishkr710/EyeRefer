import dotenv from 'dotenv'

dotenv.config({path:".env.development"});

export const Local = {
    DB_NAME:  process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    SERVER_PORT: process.env.SERVER_PORT,
    SECRET_KEY: process.env.SECRET_KEY,
    DB_DIALECT: process.env.DB_DIALECT,
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_USER: process.env.MAIL_USER
};