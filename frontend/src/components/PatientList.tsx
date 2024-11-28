/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './PatientList.css';
import moment from 'moment';
import { FaRegEye } from "react-icons/fa";

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);  // Track current page
  const patientsPerPage = 5;  // Patients to show per page

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);
  const getUser = async () => {
    try {
      const response = await api.get(`${Local.GET_USER}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.user;
    } catch (err:any) {
      toast.error("Failed to fetch user data",err);
    }
  };

  const fetchPatient = async () => {
    try {
      const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      toast.error(`Error fetching patients: ${err}`);
    }
  };
  const { data: user } = useQuery({
    queryKey: ['userData', token],
    queryFn: getUser,
  });
  const { data: Patients, error, isLoading, isError } = useQuery({
    queryKey: ['patient'],
    queryFn: fetchPatient,
  });

  // Filter patients based on search query
  const handleSearch = () => {
    if (Patients?.patientList) {
      setFilteredPatients(
        Patients.patientList.filter((patient: any) =>
          `${patient.firstname} ${patient.lastname}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }
  };

  // Reset filtered list when search query is cleared
  useEffect(() => {
    if (Patients?.patientList && searchQuery === '') {
      setFilteredPatients(Patients.patientList); // Reset to original list if search query is cleared
    }
  }, [searchQuery, Patients]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (isLoading) {
    return (
      <>
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className="text-danger">Error: {error.message}</div>
      </>
    );
  }
  return (
  
    <div className="patient-list-container">
       {user?.doctype === 1 &&(
      <p className="patient-list-title fw-medium fs-5 mb-3">Referred Patients</p>)}
   {user?.doctype === 2 && (
      <div className='refer-btn-heading' style={{ marginTop: 10 }}>
         <p className="patient-list-title fw-medium fs-5 mb-3">Referred Patients</p>
        <button className="btn-add-staff"  onClick={() => navigate("/add-patient")}>+Add Referral Patient</button>
      </div>
   )}

    {/* Search Input and Button */}
    <div className="search-border d-flex mb-4 hii1" style={{marginTop:10}} role="search">
        <input
            className="form-control me-2 hi2"
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
            aria-label="Search"
        />
        <button className="btn btn-primary btn-search" type="button" onClick={handleSearch}>
            <i className="fa fa-search" style={{ marginRight: 5 }}></i>Search
        </button>
    </div>

    {/* Patient Table */}
    <div className='table-responsive'>
    <div className="table-container">
    <table className="table table-striped"> 
            <thead>
                <tr>
                    <th style={{width:121}}>Patient Name</th>
                    <th>DOB</th>
                    <th>Consult</th>
                    <th style={{width:158}}>Appointment Date</th>
                    <th style={{width:100}}>Refer By</th>
                    <th style={{width:100}}>Refer To</th>
                    <th style={{width:100}}>Refer Back</th>
                    <th  style={{width:117}}>Consult Note</th>
                    <th >Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {currentPatients.length > 0 ? (
                    currentPatients.map((patient: any, index: number) => (
                        <tr key={index}>
                            <td>{patient.firstname} {patient.lastname}</td>
                            <td>{moment(patient.dob).format('DD-MM-YYYY')}</td>
                            <td>{patient.disease}</td>
                            <td>{patient.appointmentDate}</td>
                            <td>{patient.referedby.firstname} {patient.referedby.lastname}</td>
                            <td>{patient.referedto.firstname} {patient.referedto.lastname}</td>
                            <td>{patient.referback ? 'Yes' : 'No'}</td>
                            <td>{patient.notes}</td>
                            <td>{patient.referalstatus ? 'Completed' : 'Pending'}</td>
                            <td><Link to={`/patients-details/${patient.uuid}`}><FaRegEye className='action' /></Link></td>
                            {/* <td><Link to="/patient">Link</Link></td> */}


                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={10} className="text-center">No patients found</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
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

  );
};

export default PatientList;
