/* eslint-disable @typescript-eslint/no-unused-vars */
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import { FormControlLabel, Switch } from '@mui/material';
import "./AddPatient.css";
import io from "socket.io-client";
const AddPatient: React.FC = () => {

  const socket = io("http://localhost:3000/");
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const handleCancelReferral = () => {
    navigate('/dashboard');
  }
  const addPatient = async (data: any) => {


    try {
      const response = await api.post(`${Local.ADD_PATIENT}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      });
      console.log(response.data.data);
      socket.emit('send_notification', {
        message: `New referral patient ${response.data.data.firstname} ${response.data.data.lastname} added by ${localStorage.getItem('firstname')} ${localStorage.getItem('lastname')}`,
        receiver_id: response.data.data.referedto,
        sender_id: response.data.data.referedby,
      });

      toast.success("Patient referred successfully");
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(`${err.response?.data?.message || 'Error occurred'}`);
    }
  };


  useEffect(() => {
    if (!token) navigate('/login');
    if (localStorage.getItem("doctype") === '1') navigate('/dashboard');
  }, [navigate, token]);

  const fetchDocs = async () => {
    try {
      const response = await api.get(`${Local.GET_DOC_LIST}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error fetching doctor list');
    }
  };

  const { data: MDList, isLoading, isError, error } = useQuery({
    queryKey: ["MDList"],
    queryFn: fetchDocs,
  });

  const patientMutate = useMutation({
    mutationFn: addPatient
  });

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    gender: Yup.string().required("Gender Is required"),
    email: Yup.string().email('Invalid email').required('Email is required'),
    dob: Yup.date().required('Date of Birth is required'),
    disease: Yup.string().required("Disease Name is required"),
    referedto: Yup.string().required("Select Doctor"),
    address: Yup.string().required("Address is required"),
    // referback: Yup.string().required("Please select an option"),
    companyName: Yup.string().required("Company Name Is Required"),
    policyStartingDate: Yup.date().required("Policy Starting Date Is Required"),
    policyExpireDate: Yup.date()
      .required('Policy Ending Date is required')
      .min(new Date(), 'Policy Ending Date must be a future date')
      .typeError('Invalid date format'),
    notes: Yup.string().required("Note Is required"),
    phoneNumber: Yup.string()
      // .transform((value) => (isNaN(value) ? NaN : Number(value)))
      .required('Phone number is required'),
    // .typeError('Phone number must be a valid number'),
    laterality: Yup.string().required('Laterality is required'),
    timing: Yup.string().required('Timing Is required'),
    speciality: Yup.string().required('Speciality Is required'),
  });

  const referPatientHandler = (values: any) => {
    patientMutate.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        <div>Error: {error?.message || 'Error loading data'}</div>
      </div>
    );
  }

  return (
    <div className="add-patient-container">
      <h5 className="referral-title">Add Referral Patient</h5>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          gender: '',
          email: '',
          dob: '',
          disease: '',
          referedto: '',
          address: '',
          referback: '0',
          companyName: '',
          policyStartingDate: '',
          policyExpireDate: '',
          notes: '',
          phoneNumber: '',
          laterality: '',
          timing: '',
          speciality: '',
        }}
        validationSchema={validationSchema}
        onSubmit={referPatientHandler}
      >
        {({ values, errors }) => (
          <Form>

            <div className='fields-container'>
              <h6 className="basic-info">Basic information</h6>
              <div className='referral-fields1 row'>
                <div className="form-group col">
                  <label>Date of Birth<span className='star'>*</span></label>
                  <Field type="date" name="dob" className="form-control" style={{ color: "#495057" }} />
                  <ErrorMessage name="dob" component="div" className="text-danger" />
                </div>

                <div className="form-group col">
                  <label>Email<span className='star'>*</span></label>
                  <Field type="text" name="email" placeholder="Enter email Address" className="form-control" />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>

                <div className="form-group col">
                  <label>Phone Number<span className='star'>*</span></label>
                  <Field
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    className="form-control"
                    maxLength={10}
                  />
                  <ErrorMessage name="phoneNumber" component="div" className="text-danger" />
                </div>
              </div>


              <div className='referral-fields1 row'>
                <div className="form-group col">
                  <label>First Name<span className='star'>*</span></label>
                  <Field type="text" name="firstname" placeholder="Enter First Name" className="form-control" />
                  <ErrorMessage name="firstname" component="div" className="text-danger" />
                </div>

                <div className="form-group col">
                  <label>Last Name<span className='star'>*</span></label>
                  <Field type="text" name="lastname" placeholder="Enter Last Name" className="form-control" />
                  <ErrorMessage name="lastname" component="div" className="text-danger" />
                </div>


                <div className="form-group col">
                  <label>Gender<span className='star'>*</span></label>
                  <Field as="select" name="gender" className="form-control" v>
                    <option value="" style={{ color: "#495057" }}>Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="gender" component="div" className="text-danger" />
                </div>
              </div>


              <h6 className="basic-info">Reason of consult</h6>
              <div className='referral-fields1 row'>
                <div className="form-group col">
                  <label>Disease Name<span className='star'>*</span></label>
                  <Field as="select" name="disease" className="form-control">
                    <option value="" disabled>Select</option>
                    {['Color Blindness', 'Dry Eye', 'Floaters', 'Amblyopia (Lazy Eye)', 'Astigmatism'].map(disease => (
                      <option key={disease} value={disease}>{disease}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="disease" component="div" className="text-danger" />
                </div>


                <div className="form-group col">
                  <label>Laterality<span className='star'>*</span></label>
                  <Field as="select" name="laterality" className="form-control">
                    <option value="">Select</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="both">Both</option>
                  </Field>
                  <ErrorMessage name="laterality" component="div" className="text-danger" />
                </div>

                <div className="form-group col">
                  <label className="form-label">Patient to return to your care afterwards</label>
                  <div>
                    <Field name="referback">
                      {({ field, form }: { field: any, form: any }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              {...field}
                              checked={field.value === '1'}
                              onChange={(e) => form.setFieldValue('referback', e.target.checked ? '1' : '0')}
                            />
                          }
                          label={field.value === '1' ? 'Yes' : 'No'}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="referback" component="div" className="text-danger" />
                  </div>
                </div>

              </div>

              <div className='timing-field row'>
                <div className="form-group">
                  <label>Timing<span className='star'>*</span></label><br></br>
                  <Field as="select" name="timing" className="form-control-timing">
                    <option value="">Select</option>
                    <option value="routine">Routine(Within 1 month)</option>
                    <option value="urgent">Urgent(Within 1 Week)</option>
                    <option value="emergent">Emergent(Within 24 hours or less)</option>
                  </Field>
                  <ErrorMessage name="timing" component="div" className="text-danger" />
                </div>
              </div>

              <h6 className="basic-info">Referral to MD</h6>
              <div className='two-fields1 row'>
                <div className="form-group col">
                  <label>MD Name<span className='star'>*</span></label>
                  <Field as="select" name="referedto" className="form-control">
                    <option value="" disabled>Select</option>
                    {MDList?.docList?.map((md: any) => (
                      <option key={md.uuid} value={md.uuid}>{md.firstname} {md.lastname}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="referedto" component="div" className="text-danger" />
                </div>

                <div className="form-group col">
                  <label>Address<span className='star'>*</span></label>
                  <Field as="select" name="address" className="form-control">
                    <option value="" disabled>Choose Address</option>
                    {values.referedto && MDList.docList.find((md: any) => md.uuid === values.referedto)?.Addresses.map((address: any) => (
                      <option key={address.uuid} value={address.uuid}>
                        {address.street} {address.district} {address.city} {address.state}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="address" component="div" className="text-danger" />
                </div>
                <div className="form-group col">
                  <label>Speciality<span className='star'>*</span></label><br></br>
                  <Field as="select" name="speciality" className="form-control">
                    <option value="">Select</option>
                    <option value="opticians">Opticians</option>
                    <option value="optometrists">Optometrists</option>
                    <option value="ophthalmologists">Ophthalmologists</option>
                  </Field>
                  <ErrorMessage name="speciality" component="div" className="text-danger" />
                </div>
              </div>



              <h6 className="basic-info">Insurance Details</h6>

              <div className='referral-fields1 row'>
                <div className="form-group col">
                  <label>Company Name<span className='star'>*</span></label>
                  <Field as="select" name="companyName" className="form-control">
                    <option value="">Company Name</option>
                    <option value="Ayushman Baharat">Axis Insurance</option>
                    <option value="LIC">Digit Insurance</option>
                    <option value="Bharat Bima">Bajaj Insurance</option>
                  </Field>
                  <ErrorMessage name="companyName" component="div" className="text-danger" />
                </div>

                <div className="form-group col">
                  <label>Policy Starting Date<span className='star'>*</span></label>
                  <Field type="date" name="policyStartingDate" placeholder="Enter Date" className="form-control" style={{ color: "#495057" }} />
                  <ErrorMessage name="policyStartingDate" component="div" className="text-danger" />
                </div>

                <div className="form-group col">
                  <label>Policy Expire Date<span className='star'>*</span></label>
                  <Field type="date"
                    name="policyExpireDate" placeholder="Enter Date" className="form-control" style={{ color: "#495057" }} />
                  <ErrorMessage name="policyExpireDate" component="div" className="text-danger" />
                </div>
              </div>



              <div className="form-group row">
                <label className="notes">
                  Notes <span className="star">*</span>
                </label>
                <Field
                  as="textarea"
                  name="notes"
                  className="form-control"
                />

                <ErrorMessage
                  name="notes"
                  component="div"
                  className="text-danger"
                />
              </div>



              <div className='referral-button row'>


                <button type="submit" className="referral-btn col-2">Submit</button>



                <button type="submit" onClick={handleCancelReferral} className="btn btn-cancel1 col-2">Cancel</button>
              </div>
            </div>

            {/* </div> */}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPatient;
