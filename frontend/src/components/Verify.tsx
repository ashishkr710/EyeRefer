import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import './Verify.css';

const Verify: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('OTP')) {
            navigate('/login');
        } else {
            toast.info("OTP sent Successfully");
        }

        return () => {
            localStorage.removeItem('OTP');
        }
    }, [navigate]);

    const OTP: any = localStorage.getItem("OTP");
    const email: any = localStorage.getItem("email");

    const verifyUser = async () => {
        const response = await api.put(`${Local.VERIFY_USER}`, { email });
        return response;
    };

    const validationSchema = Yup.object().shape({
        otp: Yup.string()
            .required("OTP is required")
            .test("OTP Matched", "OTP Mismatch", (value: string) => {
                return value === OTP;
            })
    });

    const verifyMutation = useMutation({
        mutationFn: verifyUser
    });

    const handleSubmit = (values: any) => {
        if (values.otp === OTP) {
            toast.success("OTP Matched");
            verifyMutation.mutate(email);
            navigate('/login');
        } else {
            toast.error("Invalid OTP");
        }
    };

    return (
        <>
        <section className="sign-up-section">
            <div className="parent-div">
            
                <div className="left-login-wrap">
                    <div className="bg-img-div">
                        <img src="logo.png" alt="background" />
                    </div>
                </div>

             
                <div className="sign-up-form">
                    <div className="form-heading">
                        <h2>Verify OTP</h2>
                    </div>

                    <Formik
                        initialValues={{
                            otp: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form className="auth-form">
                                <div className='form-border'>
                                <div className="field-wrap input-fields">
                                    <label htmlFor="otp"><span className='star'>*</span>OTP</label>
                                    <Field
                                        type="text"
                                        name="otp"
                                        id="otp"
                                        placeholder="Enter OTP"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="otp" component="div" className="text-danger" />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-verify btn-outline-dark"
                                >
                                    Verify OTP
                                </button>
                                <div className="bottom-sec">
                        <p>Already verified? <span><Link to="/login">Login</Link></span></p>
                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                   
                </div>
            </div>
        </section>
        <section className='footer'>
            <div className='footer-content bg-dark'>
                <p className='text-white text-center m-0 p-2'>@2024 Eye Refer</p>
            </div>
        </section>
        </>
    );
};

export default Verify;
