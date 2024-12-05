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

export const addAppointment = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const { patientId, type, date } = req.body;

        const user = await User.findOne({ where: { uuid } });
        if (!user || user.doctype !== 1) {
            return res.status(403).json({ message: 'Only doctors can create appointments' });
        }

        const patient = await Patient.findOne({ where: { uuid: patientId } });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const appointment = await Appointments.create({
            patientId,
            userId: uuid,
            type,
            date,
        });

        res.status(201).json({
            message: 'Appointment added successfully',
            appointment,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error while adding appointment', error: err.message });
    }
};


export const getAppointmentList = async (req: any, res: Response): Promise<void> => {
    try {
        const { uuid: userId } = req.user;

        const appointments = await Appointment.findAll({
            where: {
                userId: userId,
            },
            attributes: ['uuid', 'date', 'type'],
            include: [
                {
                    model: Patient,
                    attributes: ['uuid', 'firstname', 'lastname', 'gender', 'email', 'dob', 'disease', 'referalstatus', 'notes', 'policyStartingDate', 'policyExpireDate', 'laterality'],
                },
                {
                    model: User,
                    attributes: ['uuid', 'firstname', 'lastname', 'email'],
                },
            ],
        });


        res.status(200).json(appointments);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

export const getAppointmentById = async (req: any, res: Response): Promise<void> => {
    try {
        const { appointmentId } = req.params;

        const appointment = await Appointment.findOne({
            where: { uuid: appointmentId },
            attributes: ['uuid', 'date', 'type'],
            include: [
                {
                    model: Patient,
                    attributes: ['uuid', 'firstname', 'lastname', 'gender', 'email', 'dob', 'disease', 'referalstatus', 'notes', 'policyStartingDate', 'policyExpireDate', 'laterality'],
                },
                {
                    model: User,
                    attributes: ['uuid', 'firstname', 'lastname', 'email'],
                },
            ],
        });

        if (appointment) {
            res.status(200).json(appointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

export const getAppointmentDetails = async (req: any, res: Response) => {
    try {
        const appointmentId = req.params.appointmentId;

        const appoinment = await Appointment.findOne({
            where: { uuid: appointmentId },
        });

        const patient = await Patient.findOne({
            where: { uuid: appoinment?.patientId },
        });

        res.status(200).json({
            appoinment,
            patient,
            message: "Patient Details Found",
        });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
};

export const updateAppointment = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const appointmentId = req.params.appointmentId;
        const { appointmentDate, appointmentType } = req.body;

        const appoinment = await Appointment.findOne({ where: { uuid: appointmentId } });
        if (!appoinment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        appoinment.date = appointmentDate || appoinment.date;
        appoinment.type = appointmentType || appoinment.type;

        await appoinment.save();

        return res.status(200).json({ message: "Appointment updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating Appointment" });
    }
};