/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */


//import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Dashboard.css';
import { useQuery } from '@tanstack/react-query';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);  // Track current page
  const patientsPerPage = 5;  // Number of patients to show per page

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const getUser = async () => {
    try {
      const response = await api.get(`${Local.GET_USER}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (err) {
      toast.error("Failed to fetch user data");
    }
  };

  const fetchPatientList = async () => {
    try {
      const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch patient data");
    }
  };

  const fetchDoctorList = async () => {
    try {
      const response = await api.get(`${Local.GET_DOCTOR_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch doctor data");
    }
  };

  const { data: userData, isError: userError, error: userErrorMsg, isLoading: userLoading } = useQuery({
    queryKey: ['userData', token],
    queryFn: getUser
  });

  const { data: patientData, isError: patientError, error: patientErrorMsg, isLoading: patientLoading } = useQuery({
    queryKey: ['patientData'],
    queryFn: fetchPatientList
  });

  const { data: doctorData, isError: doctorError, error: doctorErrorMsg, isLoading: doctorLoading } = useQuery({
    queryKey: ['doctorData'],
    queryFn: fetchDoctorList
  });

  if (userLoading || patientLoading || doctorLoading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (userError || patientError || doctorError) {
    return (
      <div className="error-container">
        <div>Error: {userErrorMsg?.message || patientErrorMsg?.message || doctorErrorMsg?.message}</div>
      </div>
    );
  }

  const { user } = userData?.data || {};
  const { patientList } = patientData || {};
  const { doctorList } = doctorData || {};

  localStorage.setItem("firstname", user?.firstname)
  localStorage.setItem("lastname", user?.lastname)

  const totalRefersReceived = patientList?.length || 0;
  const totalRefersCompleted = patientList?.filter((patient: { referalstatus: boolean }) => patient.referalstatus === true).length || 0;
  const totalDoctors = doctorList?.length || 0;

  // Pagination Logic
  const totalPages = Math.ceil(patientList?.length / patientsPerPage);
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patientList?.slice(indexOfFirstPatient, indexOfLastPatient);

  // Handle Page Change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Create Page Numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="dashboard-container">

      <h6 className="dashboard-title fw-bold" style={{fontSize:16,color:"black"}}>Dashboard</h6>
    
      <div className="metrics-cards">
        <div className="card" onClick={() => navigate('/patient')}>
          <div className='card-heading'style={{color:"black"}}>Referrals Received</div>
          <div className="card-body2">
            <div className='icon d-flex'>
              <img src="referReceived.png" alt="EyeRefer" className='icon-2'/>
              <div className="card-text">{totalRefersReceived}</div>
            </div>
            <div className='d-flex justify-content-end fw-bold' style={{color: "#737A7D"}}>Last update:Nov 27</div>
          </div>
        </div>

        <div className="card">
          <div className='card-heading'style={{color:"black"}}>Total Refers Completed</div>
          <div className="card-body2">
            <div className='icon d-flex'>
              <img src="referCompleted.png" alt="EyeRefer" className='icon-2'/>
              <div className="card-text">{totalRefersCompleted}</div>
            </div>
            <div className='d-flex justify-content-end fw-bold'  style={{color: "#737A7D"}}>Last update:Nov 27</div>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/doctor')}>
          <div className='card-heading'style={{color:"black"}}>Total Doctors OD/MD</div>
          <div className="card-body2">
            <div className='icon d-flex'>
              <img src="od_md.png" alt="EyeRefer" className='icon-2'/>
              <div className="card-text">{totalDoctors}</div>
            </div>
            <div className='d-flex justify-content-end fw-bold'  style={{color: "#737A7D"}}>Last update:Nov 27</div>
          </div>
        </div>
      </div>

      <div className='refer d-flex'>
        {user?.doctype === 2 ? (
          <>
            <h6 className="refer-title">Refer a Patient</h6>
            <button className="appointment-btn"  style={{ marginTop: -10}} onClick={() => navigate("/add-patient")}>+Add Referral Patient</button>
          </>
        ) : (
          <>
            <h6 className="refer-title fw-bold" style={{color:"black"}}>Referrals Placed</h6>
            <button className="appointment-btn fw-bold"  style={{marginTop:-5}}onClick={() => navigate("/add-appointment")}>+ Add Appointment</button>
          </>
        )}
      </div>

      <div className="patient-list-section">
        <div className="patient-table-container">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Patient Name</th>
                <th scope="col">Disease</th>
                <th scope="col">Refer by</th>
                <th scope="col">Refer to</th>
                <th scope="col">Refer back</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients?.map((patient: any, index: number) => (
                <tr key={index}>
                  <td>{patient.firstname} {patient.lastname}</td>
                  <td>{patient.disease}</td>
                  <td>{patient.referedby.firstname} {patient.referedby.lastname}</td>
                  <td>{patient.referedto.firstname} {patient.referedto.lastname}</td>
                  <td>{patient.referback ? 'Yes' : 'No'}</td>
                  <td>
                    <span className={`badge ${patient.referalstatus ? 'bg-success' : 'bg-panding'}`}>
                      {patient.referalstatus ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-end">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <a className="page-link" href="#" aria-label="Previous" onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1);
                }
              }}>
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>

            {/* Page Numbers */}
            {pageNumbers.map((number) => (
              <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <a
                  className="page-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(number);
                  }}
                >
                  {number}
                </a>
              </li>
            ))}

            {/* Next Button */}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <a className="page-link" href="#" aria-label="Next" onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  handlePageChange(currentPage + 1);
                }
              }}>
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
