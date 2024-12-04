import { Router } from "express";
import {
    registerUser,
    loginUser,
    verifyUser,
    getUser,
    getDocList,
    getPatientList,
    addPatient,
    addAddress,
    getDoctorList,
    updateprofile,
    changePassword,
    updateAddress,
    addStaff,
    getStaffList,
    deleteAddress,
    addAppointment,
    getAppointmentList,
    getPatientDetails,
    getAppointmentDetails,
    updateAppointment,
    getRooms,
    deletePatient,
    deleteStaff,
    updatePatient,
} from "../controllers/userController";
import userAuthMiddleware from "../middlewares/userAuth";
import signupValidation from "../middlewares/formValidation.ts/signupValidation";
import loginValidation from "../middlewares/formValidation.ts/loginValidation";

const router = Router();

router.post("/register", signupValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.put("/verify", verifyUser);
router.get('/user', userAuthMiddleware, getUser);
router.get('/doc-list', userAuthMiddleware, getDocList);
router.get('/doctor-list', userAuthMiddleware, getDoctorList);
router.get('/patient-list', userAuthMiddleware, getPatientList);
router.post('/add-patient', userAuthMiddleware, addPatient);
router.delete('/delete-patient', userAuthMiddleware, deletePatient); // Ensure this line is correct
router.post('/add-address', userAuthMiddleware, addAddress);
router.post('/update-profile', userAuthMiddleware, updateprofile);
router.post("/change-password", userAuthMiddleware, changePassword);
router.put('/update-address', userAuthMiddleware, updateAddress);
router.post('/add-staff', userAuthMiddleware, addStaff);
router.get('/get-staff', userAuthMiddleware, getStaffList);
router.delete('/delete-address', userAuthMiddleware, deleteAddress);
router.post('/add-appointment', userAuthMiddleware, addAppointment);
router.get('/appointment-list', userAuthMiddleware, getAppointmentList);
router.get('/patients-details/:patientId', userAuthMiddleware, getPatientDetails);
router.get("/view-appointment/:appointmentId", userAuthMiddleware, getAppointmentDetails);
router.put("/update-appointment/:appointmentId", userAuthMiddleware, updateAppointment);
router.get('/room-list', userAuthMiddleware, getRooms);
router.delete('/delete-staff/:staffId', userAuthMiddleware, deleteStaff);
router.put('/update-patient/:patientId',userAuthMiddleware,updatePatient)

export default router;
