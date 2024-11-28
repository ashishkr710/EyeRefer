import { NextFunction } from "express";
import joi from 'joi';

const validationSchema = joi.object({
    firstname: joi.string().empty().required().messages({
        'any.required': "First name is required.",
        'string.empty': "First name should be empty ."
    }),
    lastname: joi.string().empty().required().messages({
        'any.required': "Last name is required.",
        'string.empty': "Last name should be empty."
    }),
    email: joi.string().email().required().messages({
        'any.required': "Email is required.",
        'string.email': "Invalid email.",
    }),
    password: joi.string().min(8).required().messages({
        'any.required': "Password is required.",
        'string.min': "Password should be at least 8 characters."
    }),
    doctype: joi.number().required().messages({
        'any.required': "User type is required.",
    })
});


const signupValidation = (req:any, res:any, next:NextFunction) => {
    const value = validationSchema.validate(req.body);

    if(value.error){
        const errormessages = value.error.details.map(err => err.message);
        res.status(400).json({'message':errormessages});
    }
    else{
        next();
    }
}

export default signupValidation;