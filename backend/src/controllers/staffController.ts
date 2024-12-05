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

export const addStaff = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid } });




        const { staffName, gender, email, phone } = req.body;


        if (!staffName || !email || !phone || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const staff = await Staff.create({ staffName, gender, email, phone, userId: uuid });

        if (staff) {
            return res.status(201).json({ message: "Staff added successfully" });
        } else {
            return res.status(400).json({ message: "Error in adding staff" });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `Error: ${err || err}` });
    }
};

export const getStaffList = async (req: any, res: Response): Promise<void> => {
    try {
        const { uuid } = req.user;

        const staffList = await Staff.findAll({
            where: { userId: uuid },
            attributes: ['uuid', 'staffName', 'email', 'phone', 'gender'],
        });
        if (staffList.length > 0) {
            res.status(200).json(staffList);
            return
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error, please try again later.' });
        return
    }
};


export const deleteStaff = async (req: any, res: Response): Promise<void> => {
    try {
        const { uuid } = req.user; // User's UUID from token (this is good, leave it)
        const { staffId } = req.params; // Changed to get staffId from URL params instead of body

        if (!staffId) {
            res.status(400).json({ message: "Staff ID is required" });
            return;
        }

        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            res.status(401).json({ message: "You're not authorized" });
            return;
        }

        const staff = await Staff.findOne({ where: { uuid: staffId, userId: uuid } });
        if (!staff) {
            res.status(404).json({ message: "Staff not found" });
            return;
        }

        await staff.destroy();
        res.status(200).json({ message: "Staff deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting staff at backend" });
    }
};
