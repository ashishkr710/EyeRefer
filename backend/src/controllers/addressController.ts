import { Local } from "../environment/env";
import Address from "../models/Address";
import Patient from "../models/Patient";
import sendOTP from "../utils/mailer";
import User from "../models/User";
import { Response } from 'express';
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import bcrypt from 'bcrypt';
import Staff from "../models/Staff";
import Appointments from "../models/Appointments";
import { any } from "joi";
import Appointment from "../models/Appointments";
import Room from "../models/Room";

export const addAddress = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } });
        if (user) {
            const { street, district, city, state, pincode, phone, title } = req.body;
            const address = await Address.create({ street, district, city, state, pincode, phone, title, user: uuid });
            if (address) {
                res.status(200).json({ "message": "Address added Successfully" });
            }
            else {
                res.status(400).json({ "message": "Error in Saving Address" });
            }
        }
        else {
            res.status(401).json({ "message": "you're not Authorised" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
}

export const updateAddress = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const { street, district, city, state, pincode, phone } = req.body;

        const user = await User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return res.status(401).json({ "message": "You're not authorized" });
        }
        const address = await Address.findOne({ where: { user: uuid } });
        if (!address) {
            return res.status(404).json({ "message": "Address not found" });
        }

        address.street = street || address.street;
        address.district = district || address.district;
        address.city = city || address.city;
        address.state = state || address.state;
        address.pincode = pincode || address.pincode;
        address.phone = phone || address.phone;
        await address.save();

        return res.status(200).json({ "message": "Address updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ "message": "Error updating address" });
    }
};

export const deleteAddress = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const address = await Address.findOne({ where: { user: uuid } });
        if (address) {
            await address.destroy();
            return res.status(200).json({ message: "Address deleted successfully" });
        } else {
            return res.status(404).json({ message: "Address not found for this user" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error, please try again later" });
    }
};