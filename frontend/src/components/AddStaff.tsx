/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AddStaff.css';
import axios from 'axios';

const AddStaff: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<any[]>([]); 
  const [fetching, setFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const staffPerPage = 5; 

  const fetchStaff = async () => {
    setFetching(true);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to view staff.');
      navigate('/login');
      return;
    }

    try {
      const response = await api.get(import.meta.env.VITE_GET_STAFF, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setStaffList(response.data);
        setFilteredStaff(response.data); 
      } else {
        toast.error('Failed to fetch staff list.');
      }
    } catch (err: unknown) {
      toast.error('Error fetching staff list');
      console.log(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      staffName: '',
      email: '',
      phone: '',
      gender: ' ',
    },
    validationSchema: Yup.object({
      staffName: Yup.string().required('Staff Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().required('Phone Number is required'),
      gender: Yup.string().required('Gender is required'),
    }),
    onSubmit: async (values) => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to add staff.');
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await api.post('/add-Staff', values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 201) {
          toast.success('Staff added successfully');
          formik.resetForm();
          closeModal();
          fetchStaff();
        } else {
          toast.error('Failed to add staff');
        }
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
  });

  const deleteStaff = async (staffId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to delete staff.');
      navigate('/login');
      return;
    }

    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        setLoading(true);
        const response = await axios.delete(`http://localhost:3000/delete-staff/${staffId}`, { 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          toast.success('Staff deleted successfully');
          fetchStaff(); 
        } else {
          toast.error('Failed to delete staff');
        }
      } catch (err: any) {
        toast.error('Error deleting staff');
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

 
  const handleSearch = () => {
    if (searchQuery) {
      setFilteredStaff(
        staffList.filter((staff: any) =>
          `${staff.staffName}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredStaff(staffList); 
    }
  };


  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);
  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="add-staff-container">
        <div className='add-staff'>
          <h5 className="appointments-list-title">Staff List</h5>
          <button className="btn-add-staff" onClick={openModal}>+ Add Staff</button>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Staff</h3>
              <form className="add-staff-form" onSubmit={formik.handleSubmit}>
                <div className="form-group1">
                  <label htmlFor="staffName">Staff Name<span className='star'>*</span></label>
                  <input
                    type="text"
                    id="staffName"
                    className="form-control"
                    {...formik.getFieldProps('staffName')}
                  />
                  {formik.touched.staffName && formik.errors.staffName ? (
                    <div className="error">{formik.errors.staffName}</div>
                  ) : null}
                </div>

                <div className="form-group1">
                  <label htmlFor="email">Email<span className='star'>*</span></label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="error">{formik.errors.email}</div>
                  ) : null}
                </div>

                <div className="form-group1">
                  <label htmlFor="phone">Phone Number<span className='star'>*</span></label>
                  <input
                  type="text"
                  id="phone"
                  className="form-control"
                  maxLength={10}
                  {...formik.getFieldProps('phone')}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                  <div className="error">{formik.errors.phone}</div>
                  ) : null}
                </div>

                <div className="form-group1">
                  <label htmlFor="gender">Gender<span className='star'>*</span></label>
                  <select
                    id="gender"
                    className="form-control"
                    {...formik.getFieldProps('gender')}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {formik.touched.gender && formik.errors.gender ? (
                    <div className="error">{formik.errors.gender}</div>
                  ) : null}
                </div>

                <div className="add-staff-div">
                  <button type="button" className="btn btn-cancel1" onClick={closeModal}>Cancel</button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Adding Staff...' : 'Add Staff'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <form className="d-flex mb-4 hii1" style={{ marginTop: 25 }} role="search" onSubmit={(e) => e.preventDefault()}>
          <input
            className="form-control me-2 hi2"
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search"
          />
          <button className="btn btn-primary btn-search" type="button" onClick={handleSearch}>
            <i className="fa fa-search" style={{ marginRight: 5 }}></i>Search
          </button>
        </form>

        {fetching ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : currentStaff.length > 0 ? (
          <div className="staff-list-container">
            <div className="patient-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Staff Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Actions</th> 
                  </tr>
                </thead>
                <tbody>
                  {currentStaff.map((staff: any, index: number) => (
                    <tr key={staff.uuid}> 
                      <td>{staff.staffName}</td>
                      <td>{staff.email}</td>
                      <td>{staff.phone}</td>
                      <td>{staff.gender}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteStaff(staff.uuid)} 
                          disabled={loading}
                        >
                          {loading ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>No staff found.</p>
        )}

  
        <div className="pagination-controls d-flex justify-content-end mt-4 pagination-color">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <a
                  className="page-link"
                  href="#"
                  aria-label="Previous"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <a
                    className="page-link"
                    href="#"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </a>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <a
                  className="page-link"
                  href="#"
                  aria-label="Next"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default AddStaff;

