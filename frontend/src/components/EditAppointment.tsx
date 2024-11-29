// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api/axiosInstance';
// import { Local } from '../environment/env';
// import { toast } from 'react-toastify';


// const EditAppointment: React.FC = () => {
//   const { appointmentId } = useParams<{ appointmentId: string }>();
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   const [appointment, setAppointment] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     type: '',
//     date: '',
//   });

//   useEffect(() => {
//     if (!token) {
//       navigate('/login');
//     } else {
//       fetchAppointment();
//     }
//   }, [token, navigate]);

//   const fetchAppointment = async () => {
//     try {
//       const response = await api.get(`${Local.GET_APPOINTMENT}/${appointmentId}`
        
//       , {
        
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       // console.log("at featch .............................")
//       setAppointment(response.data);
//       setFormData({
//         type: response.data.type,
//         date: response.data.date,
//       });
//       // console.log('....................At Edit feach')
//     } catch (err: any) {
//       toast.error(`${err.message || 'Error fetching appointment data'}`);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.put(`${Local.GET_APPOINTMENT_LIST}/${appointmentId}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success('Appointment updated successfully');
//       navigate('/appointment-list');
//     } catch (err: any) {
//       toast.error(`${err.message || 'Error updating appointment'}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!appointment) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="edit-appointment-container">
//       <h5>Edit Appointment</h5>
//       <form onSubmit={handleFormSubmit}>
//         <div className="form-group">
//           <label htmlFor="type">Type</label>
//           <input
//             type="text"
//             id="type"
//             name="type"
//             value={formData.type}
//             onChange={handleInputChange}
//             className="form-control"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="date">Date</label>
//           <input
//             type="date"
//             id="date"
//             name="date"
//             value={formData.date}
//             onChange={handleInputChange}
//             className="form-control"
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary" disabled={loading}>
//           {loading ? 'Updating...' : 'Update Appointment'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditAppointment;