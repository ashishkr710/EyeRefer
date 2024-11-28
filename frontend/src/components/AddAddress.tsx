import {Formik, Form, Field, ErrorMessage} from 'formik'
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import React, { useEffect } from 'react';
const token = localStorage.getItem('token');

const AddAddress = ({ close } : { close: () => void }) => {
  const navigate = useNavigate();

  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  },[])
  
  const addAddress = async(data:any) =>{
    try{
      const response = await api.post(`${Local.ADD_ADDRESS}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
    catch(err:any){
      toast.error(`${err.response.message}`)
    }
  }

  const addressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: ()=>{
      toast.success("Address Saved");
      close()
    }
  })

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    street: Yup.string().required("Street is required"),
    district: Yup.string().required("District is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    phone: Yup.string().required("Phone number is required"),
    pincode: Yup.number().required("Pincode is required"),
  })

  const addressHandler = (values:any) =>{
    addressMutation.mutate(values);
  }
  return (
    <Formik
    initialValues={{
      title:"",
      street: "",
      district: "",
      state: "",
      city: "",
      phone: "",
      pincode: "",
      }}
      validationSchema={validationSchema}
      onSubmit={addressHandler}
    >
      {()=>(
        <>
              <Form>
              <div className="form-group1"> 
                  <label>Title<span className='star'>*</span></label>
                  <Field type="title" name="title" className="form-control1"/>
                  <ErrorMessage name="title" component="div" className="text-danger1"/>
                </div>

                <div className="form-group1"> 
                  <label>Street<span className='star'>*</span></label>
                  <Field type="text" name="street" className="form-control1"/>
                  <ErrorMessage name="street" component="div" className="text-danger1"/>
                </div>
            

                <div className="form-group1">
                  <label>District<span className='star'>*</span></label>
                  <Field type="text" name="district" className="form-control1"/>
                  <ErrorMessage name="district" component="div" className="text-danger1"/>
                </div>
             
                
                <div className="form-group1">
                  <label>State<span className='star'>*</span></label>
                  <Field type="text" name="state" className="form-control1"/>
                  <ErrorMessage name="state" component="div" className="text-danger1"/>
                </div>
                           
                <div className="form-group1">
                  <label>City<span className='star'>*</span></label>
                  <Field type="text" name="city" className="form-control1"/>
                  <ErrorMessage name="city" component="div" className="text-danger1"/>
                </div>
             
                
                <div className="form-group1">
                  <label>Phone<span className='star'>*</span></label>
                  <Field type="text" name="phone" maxLength={10} className="form-control1"/>
                  <ErrorMessage name="phone" component="div" className="text-danger1"/>
                </div>
           
                
                <div className="form-group1">
                  <label>Pincode<span className='star'>*</span></label>
                  <Field type="text" name="pincode" maxLength={6} className="form-control1" />
                  <ErrorMessage name="pincode" component="div" className="text-danger1"/>
                </div>
                
                <button type="submit" className='btn btn-outline-dark'>Submit</button>
              </Form>
        </>
      )}
    </Formik>
  )
}

export default AddAddress;