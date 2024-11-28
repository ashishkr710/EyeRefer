/* eslint-disable @typescript-eslint/no-unused-vars */
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import "./AddAppointment.css";

const AddAppointment: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const cancleAddAppointment = () => {
    navigate('/appointment-list')
  }
  // Ensure only MDs can add appointments
  useEffect(() => {
    if (!token) navigate('/login');
    if (localStorage.getItem("doctype") !== '1') navigate('/dashboard');
  }, [navigate, token]);

  // Fetch Patients List
  const fetchPatients = async () => {
    try {
      const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Patient List:', response.data.patientList);
      return response.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error fetching patient list');
      return [];
    }
  };

  // Fetch Doctor List (this can be used to confirm that the user is a doctor)
  const fetchDocs = async () => {
    try {
      const response = await api.get(`${Local.GET_DOC_LIST}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error fetching doctor list');
    }
  };

  // Use React Query to fetch patient and doctor data
  const { data: patientList, isLoading: isLoadingPatients, isError: isErrorPatients, error: errorPatients } = useQuery({
    queryKey: ["patientList"],
    queryFn: fetchPatients,
  });

  // const a=patientList.patientList;
  // console.log(a)

  // patientList.patientList.map((patt:any,index:any)=>(
  //   console.log(patt.firstname)
  // ))


  const { data: MDList, isLoading: isLoadingDocs, isError: isErrorDocs, error: errorDocs } = useQuery({
    queryKey: ["MDList"],
    queryFn: fetchDocs,
  });

  // Mutation to add appointment
  const addAppointment = async (data: any) => {
    try {
      const response = await api.post(`${Local.ADD_APPOINTMENT}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Appointment added successfully");
      navigate('/appointment-list');
    } catch (err: any) {
      toast.error(`${err.response?.data?.message || 'Error occurred'}`);
    }
  };

  const appointmentMutate = useMutation({
    mutationFn: addAppointment,
  });

  const validationSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    type: Yup.string().required("Appointment type is required"),
    date: Yup.date().required("Date is required"),
  });

  const referAppointmentHandler = (values: any) => {
    appointmentMutate.mutate({
      patientId: values.patientId,
      userId: localStorage.getItem('uuid'),
      type: values.type,
      date: values.date,
    });
  };

  if (isLoadingPatients || isLoadingDocs) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isErrorPatients || isErrorDocs) {
    return (
      <div className="error-container">
        <div>Error: {errorPatients?.message || errorDocs?.message || 'Error loading data'}</div>
      </div>
    );
  }

  return (
    <div className="add-appointment-container">
      <p className="add-title fw-medium fs-5">Add Appointment</p>
      <Formik
        initialValues={{
          patientId: '',
          type: '',
          date: '',
        }}
        validationSchema={validationSchema}
        onSubmit={referAppointmentHandler}
      >
        {({ values }) => (
          <Form>
            <div className="form-group">
              <div className='fieldflex row'>
                <div className="form-field1 col">
                  <label htmlFor="patientId" className='add-appointment-lable'>Patient Name<span className='star'>*</span></label>
                  <Field as="select" name="patientId" className="form-select1">
                    <option value="" disabled>Select</option>
                    {patientList.patientList?.length > 0 ? (
                      patientList.patientList.map((patient: any) => (
                        <option key={patient.uuid} value={patient.uuid}>
                          {patient.firstname} {patient.lastname}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No patients available</option>
                    )}
                  </Field>
                  <ErrorMessage name="patientId" component="div" className="text-danger" />
                </div>
                <div className="form-field1 col">
                  <label htmlFor="date" className='add-appointment-lable'>Appointment Date<span className='star'>*</span></label>
                  <Field type="date" name="date" className="form-select1" />
                  <ErrorMessage name="date" component="div" className="text-danger" />
                </div>
                <div className="form-field1 col">
                  <label htmlFor="type" className='add-appointment-lable'>Type<span className='star'>*</span></label>
                  <Field as="select" name="type" className="form-select1">
                    <option value="" disabled>Select</option>
                    {['Surgery', 'Consultation'].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="type" component="div" className="text-danger" />
                </div>

              </div>
            </div>
            <div className="btn-subcancel">
              <button type="button" onClick={cancleAddAppointment} className="btn btn-cancel1">Cancel</button>
              <button type="submit" className="appointment-btn">Add Appointment</button>
            </div>

          </Form>
        )}
      </Formik>

    </div>
  );
};

export default AddAppointment;


