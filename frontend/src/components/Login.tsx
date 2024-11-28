/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable @typescript-eslint/no-unused-vars
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import './Login.css'; // Ensure this is the correct path

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const authUser = async (loginData: any) => {
    try {
      const response: any = await api.post(`${Local.LOGIN_USER}`, loginData);
      if (response.status === 200) {
        if (response.data.user.is_verified) {
          localStorage.setItem('firstname', response.data.user.firstname)
          localStorage.setItem('lastname',response.data.user.lastname)
          localStorage.setItem("doctype", response.data.user.doctype);
          localStorage.setItem("token", response.data.token);
          toast.success("Login Successfully");
          navigate('/dashboard');
        } else {
          localStorage.setItem("email", response?.data?.user?.email);
          localStorage.setItem("OTP", response.data.OTP);
          toast.warn("User not Verified");
          navigate("/Verify");
        }
        return response;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      return;
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, "Password must be atleast 8 characters long").required("Password is required")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, "Password must contain at least one special Character")
  });

  const loginMutate = useMutation({
    mutationFn: authUser,
  });

  const loginSubmit = async (values: any) => {
    loginMutate.mutate(values);
  };

  return (
    <>
    <section className="sign-up-section">
      <div className="parent-div">
        <div className="left-login-wrap">
          <div className="bg-img-div">
            <img src='logo.png' alt="loginbg" />
          </div>
        </div>

        <div className="sign-up-form">
          <div className="form-heading">
            <h2>Login</h2>
          </div>

          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={loginSubmit}
          >
            {() => (
              <Form className="auth-form">
                <div className='form-border'>
                <div className="field-wrap input-fields">
                  <label htmlFor="email">Email<span className='star'>*</span></label>
                  <Field 
                    name="email" 
                    type="email" 
                    id="email" 
                    placeholder="Enter your Email" 
                    className="form-control" 
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>

                <div className="field-wrap input-fields">
                  <label htmlFor="password">Password<span className='star'>*</span></label>
                  <Field 
                    name="password" 
                    type="password" 
                    id="password" 
                    placeholder="Enter your Password" 
                    className="form-control" 
                  />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                <button 
                  type="submit" 
                  className="btn-login btn-outline-dark sign-up-btn"
                >
                  Login
                </button>
                <div className="bottom-sec">
            <p>Don't have an Account? <span><Link to="/" color='#57cdec'>Sign Up</Link></span></p>
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

export default Login;
