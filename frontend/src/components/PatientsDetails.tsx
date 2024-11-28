import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
import './PatientDetails.css'
import { IoIosArrowBack } from "react-icons/io";
import moment from 'moment';
import Chat from './Chat'; // Import the Chat component

const PatientDetails: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const getPatient = async () => {
        try {
            const response = await api.get(`${Local.GET_PATIENT_DETAILS}/${patientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.patientDetails;
        } catch (err) {
            toast.error("Failed to fetch user data");
            console.log(err)
        }
    };

    const { data: patientData, isError, error, isLoading } = useQuery({
        queryKey: ['patientData?'],
        queryFn: getPatient
    });


    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [token]);

    if (isLoading) {
        return (
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        );
    }

    if (isError) {
        return <div className="text-danger">Error: {error instanceof Error ? error.message : 'An error occurred'}</div>;
    }

    if (!patientData) {
        return <div>Patient not found.</div>;
    }

    return (
        <div className="patient-details-container">
            <div className='details-btn'>
                <p className='back fw-bold' onClick={() => navigate("/patient")}><IoIosArrowBack /> Back</p >
                <button className="appointment-btn" onClick={() => navigate("/add-patient")}>+ Add Referral Patient</button>
            </div>
            <div className='patient-info'>
                <h6 className="fw-bold" style={{ marginTop: '1.5rem', marginBottom: "1.5rem" }}>Basic Information</h6>
                <div className="patient-details">
                    <form>

                        <div className='name-info row'>
                            <div className="form-group2 col" style={{ marginTop: 15 }}>
                                <label htmlFor="name">First Name: {patientData?.firstname} {patientData?.lastname}</label>
                            </div>

                            <div className="form-group2 col " style={{ marginTop: 15 }}>
                                <label htmlFor="gender">Gender:{patientData?.gender}</label>
                            </div>
                            <div className="form-group2 col" style={{ marginTop: 15 }}>
                                <label htmlFor="date">Date Of Birth:{moment(patientData?.dob).format('DD-MM-YYYY')}</label>
                            </div>


                            <div className="form-group4 row py-3">
                                <div className="form-group2 col">
                                    <label htmlFor="phone">Phone: {patientData?.phoneNumber}</label>
                                </div>
                                <div className="form-group2 col">
                                    <label htmlFor="email">Email: {patientData?.email}</label>
                                </div>
                            </div>

                        </div>

                        <p style={{ marginTop: '1.5rem', marginBottom: "1.5rem", fontSize: 16, color: "black" }}>Reason of consult</p >

                        <div className='name-info row'>
                            <div className="form-group2 col p-3" >
                                <label htmlFor="text">Reason: {patientData?.disease}</label>
                            </div>

                            <div className="form-group2 col p-3">
                                <label htmlFor="text">Laterality: {patientData?.laterality}</label>
                            </div>
                        </div>

                        {/* Add the Chat component */}
                        <Chat patientId={patientData?.id} />

                        <p style={{ marginTop: '1.5rem', marginBottom: "1.5rem", fontSize: 16, color: "black" }}>Referral OD/MD</p >

                        <div className='name-info row'>
                            <div className="form-group2 col p-3">
                                <label htmlFor="name">MD/OD Name: {`${patientData?.referedby?.firstname} ${patientData?.referedby?.lastname}`}</label>
                            </div>

                            <div className="form-group2 col p-3">
                                <label htmlFor="gender">Location: {patientData?.address?.street}</label>
                            </div>
                            <div className="form-group2 col p-3">
                                <label htmlFor="date">Speciality:{patientData?.speciality}</label>
                            </div>
                        </div>


                        <p style={{ marginTop: '1.5rem', marginBottom: "1.5rem", fontSize: 16, color: "black" }}>Appointment Details</p >

                        <div className='name-info row'>
                            <div className="form-group2 col p-3">
                                <label htmlFor="name">Appointment Date Time: {patientData?.appointment?.date}</label>
                                <span className="form-group2 col p-3">
                                    <label htmlFor="text" style={{ padding: '0px 5%' }}>Type: {patientData?.appointment?.type}</label>
                                </span  >
                            </div>


                        </div>

                        <p style={{ marginTop: '1.5rem', marginBottom: "1.5rem", fontSize: 16, color: "black" }}>Insurance Details</p >

                        <div className='name-info row'>
                            <div className="form-group2 col p-3">
                                <label htmlFor="name">Company Name : {patientData?.companyName}</label>
                            </div>

                            <div className="form-group2 col p-3">
                                <label htmlFor="gender">Policy Start Date: {moment(patientData?.policyStartingDate).format("DD-MM-YYYY")}</label>
                            </div>

                            <div className="form-group2 col p-3">
                                <label htmlFor="gender">Policy End Date: {moment(patientData?.policyExpireDate).format("DD-MM-YYYY")}</label>
                            </div>
                        </div>


                        <p style={{ marginTop: '1.5rem', marginBottom: "1.5rem", fontSize: 16, color: "black" }}>Notes</p >

                        <div className='name-info row'>
                            <div className="form-group2 col p-3">
                                <label htmlFor="name">Notes : {patientData?.notes}</label>
                            </div>
                        </div>











                        {/* <div className="form-group2 col">
                        <label htmlFor="referedBy">MD/OD Name {`${patientData?.referedby?.firstname} ${patientData?.referedby?.lastname}`}</label> 
                    </div> */}

                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;