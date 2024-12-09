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


export const getPatientDetails = async (req: any, res: Response) => {
    try {
        const patientId = req.params.patientId;

        const patient = await Patient.findOne({
            where: { uuid: patientId },
            include: [
                {
                    model: User,
                    as: 'referedtoUser',
                    attributes: ['firstname', 'lastname'],
                },
                {
                    model: User,
                    as: 'referedbyUser',
                    attributes: ['firstname', 'lastname'],
                },
                {
                    model: Address,
                    attributes: ['street', 'city', 'state', 'pincode'],
                },
                {
                    model: Appointments,
                    attributes: ['date', "type"],
                }
            ]
        });

        const appoinment = await Appointment.findOne({ where: { patientId } })

        if (patient) {
            const patientDetails = {
                uuid: patient.uuid,
                firstname: patient.firstname,
                lastname: patient.lastname,
                gender: patient.gender,
                email: patient.email,
                dob: patient.dob,
                disease: patient.disease,
                referalstatus: patient.referalstatus,
                referback: patient.referback,
                companyName: patient.companyName,
                policyStartingDate: patient.policyStartingDate,
                policyExpireDate: patient.policyExpireDate,
                notes: patient.notes,
                phoneNumber: patient.phoneNumber,
                laterality: patient.laterality,
                timing: patient.timing,
                speciality: patient.speciality,
                referedto: patient.referedtoUser,
                referedby: patient.referedbyUser,
                address: patient.Address,
                appointment: appoinment
            };

            res.status(200).json({
                patientDetails,
                message: 'Patient Details Found',
            });
        } else {
            res.status(404).json({ message: 'Patient Not Found' });
        }
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
};

export const getPatientList = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } });

        if (user) {

            let patientList: any = await Patient.findAll({
                where: {
                    [Op.or]: [{ referedby: uuid }, { referedto: uuid }]
                },
                include: [
                    {
                        model: Appointments,
                        attributes: ['date', 'type']
                    }
                ]
            });

            if (patientList) {
                const plist: any[] = [];

                for (const patient of patientList) {
                    const [referedtoUser, referedbyUser, address] = await Promise.all([
                        User.findOne({ where: { uuid: patient.referedto } }),
                        User.findOne({ where: { uuid: patient.referedby } }),
                        Address.findOne({ where: { uuid: patient.address } })
                    ]);

                    const appointmentData = patient.Appointments ? patient.Appointments[0] : null;

                    const newPatientList: any = {
                        uuid: patient.uuid,
                        firstname: patient.firstname,
                        lastname: patient.lastname,
                        disease: patient.disease,
                        referalstatus: patient.referalstatus,
                        referback: patient.referback,
                        createdAt: patient.createdAt,
                        updatedAt: patient.updatedAt,
                        referedto: referedtoUser,
                        referedby: referedbyUser,
                        address: address,
                        dob: patient.dob,
                        notes: patient.notes,
                        appointmentDate: appointmentData ? appointmentData.date : null,
                        appointmentType: appointmentData ? appointmentData.type : null 
                    };

                    plist.push(newPatientList);
                }


                res.status(200).json({ "patientList": plist, "message": "Patient List Found" });
            } else {
                res.status(404).json({ "message": "Patient List Not Found" });
            }
        } else {
            res.status(404).json({ "message": "User Not Found" });
        }
    } catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
};

export const addPatient = async (req: any, res: Response) => {
    try {

        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } });
        if (user) {
            const { firstname, lastname, gender, email, dob, disease, address, referedto, referback, companyName, policyStartingDate, policyExpireDate, notes, phoneNumber, laterality, timing, speciality } = req.body;

            const patient = await Patient.create({ firstname, lastname, gender, email, dob, disease, address, referedto, referback, companyName, policyStartingDate, policyExpireDate, notes, phoneNumber, laterality, timing, speciality, referedby: uuid });
            if (patient) {
                res.status(200).json({ "message": "Patient added Successfully", "data": patient });
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

export const updatePatient = async (req: any, res: Response): Promise<void> => {
    try {
        const { uuid } = req.user;
        const patientId = req.params.patientId;
        const { firstname, lastname, gender, email, dob, disease, address, referedto, referback, referalstatus, companyName, policyStartingDate, policyExpireDate, notes, phoneNumber, laterality, timing, speciality } = req.body;

        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            res.status(401).json({ message: "You're not authorized" });
            return;
        }

        const patient = await Patient.findOne({ where: { uuid: patientId } });
        if (!patient) {
            res.status(404).json({ message: "Patient not found" });
            return;
        }

        patient.firstname = firstname || patient.firstname;
        patient.lastname = lastname || patient.lastname;
        patient.gender = gender || patient.gender;
        patient.email = email || patient.email;
        patient.dob = dob || patient.dob;
        patient.disease = disease || patient.disease;
        patient.Address = address || patient.Address;
        patient.referedto = referedto || patient.referedto;
        patient.referback = referback || patient.referback;
        patient.companyName = companyName || patient.companyName;
        patient.policyStartingDate = policyStartingDate || patient.policyStartingDate;
        patient.policyExpireDate = policyExpireDate || patient.policyExpireDate;
        patient.notes = notes || patient.notes;
        patient.phoneNumber = phoneNumber || patient.phoneNumber;
        patient.laterality = laterality || patient.laterality;
        patient.timing = timing || patient.timing;
        patient.speciality = speciality || patient.speciality;
        patient.referalstatus = referalstatus || patient.referalstatus;

        await patient.save();

        res.status(200).json({ message: "Patient updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating patient" });
    }
};

export const deletePatient = async (req: any, res: Response): Promise<void> => {
    try {
        const { patientId } = req.body; 
        const { uuid } = req.user;

        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            res.status(401).json({ message: "You're not authorized" });
            return;
        }

        const patient = await Patient.findOne({ where: { uuid: patientId } });
        if (!patient) {
            res.status(404).json({ message: "Patient not found" });
            return;
        }

        await patient.destroy();
        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting patient" });
    }
};