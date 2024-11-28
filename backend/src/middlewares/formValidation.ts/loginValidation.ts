import { NextFunction } from "express";
import joi from 'joi';

const validationSchema = joi.object({
    email: joi.string().email().required().messages({
        'any.required': "Email is required.",
        'string.email': "Invalid email.",
    }),
    password: joi.string().min(8).required().messages({
        'any.required': "Password is required.",
        'string.min': "Password should be at least 8 characters."
    }),
});


const loginValidation = (req:any, res:any, next:NextFunction) => {
    const value = validationSchema.validate(req.body);

    if(value.error){
        res.status(400).json({'message':value.error.message});
    }
    else{
        next();
    }
}

export default loginValidation;