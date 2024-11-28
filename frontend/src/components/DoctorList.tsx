/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './DoctorList.css'; // Custom styles can be added for spacing or adjustments

const DoctorList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);  // Track current page
  const doctorsPerPage = 5;  // Doctors to show per page

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  // Fetch doctor list
  const fetchDoctor = async () => {
    try {
      const response = await api.get(`${Local.GET_DOCTOR_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      toast.error(`Error fetching doctor data: ${err}`);
    }
  };

  // Use React Query to fetch the doctor data
  const { data: doctors, error, isLoading, isError } = useQuery({
    queryKey: ['doctor'],
    queryFn: fetchDoctor,
  });

  // Filter doctors based on search query
  const handleSearch = () => {
    if (doctors?.doctorList) {
      setFilteredDoctors(
        doctors.doctorList.filter((doctor: any) =>
          `${doctor.firstname} ${doctor.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  };

  // Reset filtered list when search query is cleared
  useEffect(() => {
    if (doctors?.doctorList && searchQuery === '') {
      setFilteredDoctors(doctors.doctorList); // Reset to original list if search query is cleared
    }
  }, [searchQuery, doctors]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="error-container">
        <div className="text-danger">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="doctor-list-container">
      <h5 className="referral-title">Doctor List</h5>

      {/* Search Input and Button */}
      <form className="d-flex mb-4 hii1" style={{marginTop:10}} role="search">
        <input
          className="form-control me-2 hi2"
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
          aria-label="Search"
        />
        <button className="btn btn-primary btn-search" type="button" onClick={handleSearch}>
        <i className="fa fa-search" style={{ marginRight: 1}}></i> Search
        </button>
      </form>

      <div className="table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Doctor First Name</th>
              <th scope="col">Doctor Last Name</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            {/* Render filtered doctors */}
            {currentDoctors.length > 0 ? (
              currentDoctors.map((doctor: any, _index: number) => (
                <tr key={doctor.id}>
                  <td>{doctor.firstname}</td>
                  <td>{doctor.lastname}</td>
                  <td>{doctor.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center">No doctors found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-end">
       
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a
              className="page-link"
              href="#"
              aria-label="Previous"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>

      
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <li
              key={pageNumber}
              className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
            >
              <a
                className="page-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pageNumber);
                }}
              >
                {pageNumber}
              </a>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <a
              className="page-link"
              href="#"
              aria-label="Next"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DoctorList;
