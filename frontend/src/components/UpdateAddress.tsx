/* eslint-disable @typescript-eslint/no-unused-vars */
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import React, { useEffect } from 'react';

const token = localStorage.getItem('token');

interface Address {
  uuid: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

const UpdateAddress = ({ address, close }: { address: Address, close: () => void }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, []);
const handleNavigate=()=>{
    navigate('/profile')
}
  const updateAddressMutation = useMutation({
    mutationFn: (data: Address) => {
      return api.put(`${Local.UPDATE_ADDRESS}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success('Address Updated');
      close();  // Close the modal
    },
    onError: (error) => {
      toast.error('Error updating address');
    },
  });

  const validationSchema = Yup.object().shape({
    street: Yup.string().required('Street is required'),
    district: Yup.string().required('District is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    // phone: Yup.string().required('Phone number is required'),
    pincode: Yup.number().required('Pincode is required'),
  });

  const handleSubmit = (values: Address) => {
    updateAddressMutation.mutate(values);
  };

  return (
    <Formik
      initialValues={{
        ...address,  // Pre-fill the form with the selected address
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <div className="form-group">
            <label>Street<span className='star'>*</span></label>
            <Field type="text" name="street" className="form-control" />
            <ErrorMessage name="street" component="div" className="text-danger" />
          </div>
          <br />

          <div className="form-group">
            <label>District<span className='star'>*</span></label>
            <Field type="text" name="district" className="form-control" />
            <ErrorMessage name="district" component="div" className="text-danger" />
          </div>
          <br />

          <div className="form-group">
            <label>State<span className='star'>*</span></label>
            <Field type="text" name="state" className="form-control" />
            <ErrorMessage name="state" component="div" className="text-danger" />
          </div>
          <br />

          <div className="form-group">
            <label>City<span className='star'>*</span></label>
            <Field type="text" name="city" className="form-control" />
            <ErrorMessage name="city" component="div" className="text-danger" />
          </div>
          <br />

          {/* <div className="form-group">
            <label>Phone</label>
            <Field type="text" name="phone" className="form-control" maxLength={10} />
            <ErrorMessage name="phone" component="div" className="text-danger" />
          </div> */}
          <br />

          <div className="form-group">
            <label>Pincode<span className='star'>*</span></label>
            <Field type="text" name="pincode" className="form-control" maxLength={6} />
            <ErrorMessage name="pincode" component="div" className="text-danger" />
          </div>
          <br />
          <button type="submit" onClick={handleNavigate} className="btn btn-outline-dark">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateAddress;
