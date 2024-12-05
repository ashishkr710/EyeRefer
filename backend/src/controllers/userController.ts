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

const Security_Key: any = Local.SECRET_KEY;

const otpGenerator = () => {
    return String(Math.round(Math.random() * 10000000000)).slice(0, 6);
}

export const registerUser = async (req: any, res: Response) => {
    try {
        const { firstname, lastname, doctype, email, password } = req.body;
        const isExist = await User.findOne({ where: { email: email } });
        if (isExist) {
            res.status(401).json({ "message": "User already Exist" });
        }
        else {

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ firstname, lastname, doctype, email, password: hashedPassword });
            if (user) {
                const OTP = otpGenerator();
                sendOTP(user.email, OTP);
                res.status(201).json({ "OTP": OTP, "message": "Data Saved Successfully" });
            }
            else {
                res.status(403).json({ "message": "Something Went Wrong" });
            }
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
}

export const verifyUser = async (req: any, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user) {
            user.is_verified = true;
            user.save();
            res.status(200).json({ "message": "User Verfied Successfully" });
        }
        else {
            res.status(403).json({ "message": "Something Went Wrong" })
        }
    }
    catch (err) {
        res.status(500).json({ "message": err })
    }
}

export const loginUser = async (req: any, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                if (user.is_verified) {
                    const token = jwt.sign({ uuid: user.uuid }, Security_Key);
                    res.status(200).json({ "token": token, "user": user, "message": "Login Successfull" });
                }
                else {
                    const OTP = otpGenerator();
                    sendOTP(user.email, OTP);
                    res.status(200).json({ "user": user, "OTP": OTP, "message": "OTP sent Successfully" });
                }
            }
            else {
                res.status(403).json({ "message": "Invalid Password" });
            }
        }
        else {
            res.status(403).json({ "message": "User doesn't Exist" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
}

export const getUser = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid }, include: Address });
        if (user) {
            const referCount = await Patient.count({ where: { referedto: uuid } });
            const referCompleted = await Patient.count({ where: { referedto: uuid, referalstatus: 1 } });
            let docCount;

            if (user.doctype == 1) {
                docCount = await User.count({ where: { is_verified: 1 } });
            }
            else {
                docCount = await User.count({ where: { is_verified: 1, doctype: 1 } });
            }
            res.status(200).json({ "user": user, "message": "User Found", "docCount": docCount, "referCount": referCount, "referCompleted": referCompleted });
        }
        else {
            res.status(404).json({ "message": "User Not Found" })
        }
    }
    catch (err) {
        res.status(500).json({ "message": `Error--->${err}` })
    }
}

export const getDocList = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } })
        let docList;
        if (user?.doctype == 1) {
            docList = await User.findAll({ where: { uuid: { [Op.ne]: uuid } }, include: Address });
        }
        else {
            docList = await User.findAll({ where: { doctype: 1, uuid: { [Op.ne]: uuid } }, include: Address });
        }
        if (docList) {
            res.status(200).json({ "docList": docList, "message": "Docs List Found" });
        }
        else {
            res.status(404).json({ "message": "MD List Not Found" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }

}

export const getDoctorList = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;


        const user = await User.findOne({ where: { uuid: uuid }, include: Address });

        if (user) {
            const referCount = await Patient.count({ where: { referedto: uuid } });

            const referCompleted = await Patient.count({ where: { referedto: uuid, referalstatus: 1 } });

            const docCount = await User.count({
                where: {
                    is_verified: 1,
                    doctype: [1, 2],
                }
            });

            const doctorList = await User.findAll({
                where: {
                    doctype: [1, 2],
                    is_verified: 1,
                },
                include: Address,
            });


            res.status(200).json({
                user,
                message: "User Found",
                docCount,
                referCount,
                referCompleted,
                doctorList,
            });
        } else {
            res.status(404).json({ message: "User Not Found" });
        }
    } catch (err) {
        console.error("Error fetching doctor list:", err);
        res.status(500).json({ message: `Error: ${err}` });
    }
};


export const getUserProfile = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid }, include: Address });

        if (!user) {
            return res.status(404).json({ "message": "User Not Found" });
        }

        // Fetch additional counts or data based on the user type
        let profileDetails: any = {
            user: user,
            message: "User Found",
        };

        if (user.doctype === 1) { // If user is a Doctor
            // Doctor-specific data
            const patientCount = await Patient.count({ where: { referedto: uuid } });
            const referredPatients = await Patient.findAll({ where: { referedto: uuid } });
            profileDetails = {
                ...profileDetails,
                patientCount: patientCount,
                referredPatients: referredPatients,
            };
        } else if (user.doctype === 2) {
            const referredDoctors = await User.findAll({ where: { uuid: { [Op.in]: user.referredby } }, include: Address });
            profileDetails = {
                ...profileDetails,
                referredDoctors: referredDoctors,
            };
        } else {

            profileDetails = {
                ...profileDetails,
                additionalData: "Custom data for Admin or other types"
            };
        }

        res.status(200).json(profileDetails);
    } catch (err) {
        res.status(500).json({ "message": `Error--->${err}` });
    }
};

export const updateprofile = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const { firstname, lastname, phone, email, gender } = req.body;

        const user = await User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.phone = phone || user.phone;
        user.email = email || user.email;
        user.gender = gender || user.gender;

        await user.save();

        return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating profile" });
    }
};

export const changePassword = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const { currentPassword, newPassword } = req.body;


        const user = await User.findOne({ where: { uuid } });

        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(403).json({ "message": "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ "message": "Password updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ "message": "Error updating password" });
    }
};

export const getRooms = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findByPk(uuid);
        if (user) {
            const rooms = await Room.findAll({
                where: {
                    [Op.or]: [
                        { user_id_1: user.uuid },
                        { user_id_2: user.uuid }]
                },
                include: [
                    {
                        model: User,
                        as: 'doc1'
                    },
                    {
                        model: User,
                        as: 'doc2'
                    },
                    {
                        model: Patient,
                        as: 'patient'
                    }
                ]
            });
            res.status(200).json({ "room": rooms, "user": user });
        } else {
            res.status(404).json({ "message": "You're not authorized" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
}