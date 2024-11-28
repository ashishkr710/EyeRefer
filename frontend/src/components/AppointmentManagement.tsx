// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import api from '../api/axiosInstance';
// import { Local } from '../environment/env';
// import { toast } from 'react-toastify';
// import './AppointmentManagement.css';

// // Define the types for Appointment and Patient
// interface Appointment {
//   id: string;
//   patientId: string;
//   appointmentDate: string;
//   type: 'Consultation' | 'Surgery';
//   status: 'Completed' | 'Pending' | 'Cancelled';
// }

// const AppointmentManagement: React.FC = () => {
//   const { patientId } = useParams();
//   const navigate = useNavigate();
//   const [appointmentDate, setAppointmentDate] = useState('');
//   const [appointmentType, setAppointmentType] = useState<'Consultation' | 'Surgery'>('Consultation');
//   const [appointmentStatus, setAppointmentStatus] = useState<'Completed' | 'Pending' | 'Cancelled'>('Pending');

//   // Fetch the appointments of the selected patient
//   const fetchAppointments = async () => {
//     try {
//       const response = await api.get(`${Local.GET_PATIENT_APPOINTMENTS}/${patientId}`);
//       return response.data;
//     } catch (err) {
//       toast.error('Error fetching appointments.');
//     }
//   };

//   const { data: appointments, isLoading, isError, error } = useQuery(
//     ['appointments', patientId],
//     fetchAppointments
//   );

//   const queryClient = useQueryClient();
  
//   // Handle creating a new appointment
//   const appointmentMutation = useMutation(
//     async () => {
//       const newAppointment = { patientId, appointmentDate, type: appointmentType, status: appointmentStatus };
//       const response = await api.post(`${Local.CREATE_APPOINTMENT}`, newAppointment);
//       return response.data;
//     },
//     {
//       onSuccess: () => {
//         toast.success('Appointment created successfully');
//         queryClient.invalidateQueries(['appointments', patientId]);
//       },
//       onError: () => {
//         toast.error('Error creating appointment');
//       },
//     }
//   );

//   const handleAddAppointment = () => {
//     appointmentMutation.mutate();
//   };

//   // Handle loading state
//   if (isLoading) {
//     return <div>Loading appointments...</div>;
//   }

//   // Handle error state
//   if (isError) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div className="appointment-management-container">
//       <h2>Manage Appointments for Patient {patientId}</h2>

//       {/* Add Appointment Form */}
//       <div className="appointment-form">
//         <div>
//           <label>Appointment Date</label>
//           <input
//             type="date"
//             value={appointmentDate}
//             onChange={(e) => setAppointmentDate(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>Appointment Type</label>
//           <select
//             value={appointmentType}
//             onChange={(e) => setAppointmentType(e.target.value as 'Consultation' | 'Surgery')}
//           >
//             <option value="Consultation">Consultation</option>
//             <option value="Surgery">Surgery</option>
//           </select>
//         </div>

//         <div>
//           <label>Status</label>
//           <select
//             value={appointmentStatus}
//             onChange={(e) => setAppointmentStatus(e.target.value as 'Completed' | 'Pending' | 'Cancelled')}
//           >
//             <option value="Pending">Pending</option>
//             <option value="Completed">Completed</option>
//             <option value="Cancelled">Cancelled</option>
//           </select>
//         </div>

//         <button onClick={handleAddAppointment}>Add Appointment</button>
//       </div>

//       {/* Appointments List */}
//       <div>
//         <h3>Appointments</h3>
//         {appointments && appointments.length > 0 ? (
//           <table className="appointments-table">
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Type</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {appointments.map((appointment) => (
//                 <tr key={appointment.id}>
//                   <td>{appointment.appointmentDate}</td>
//                   <td>{appointment.type}</td>
//                   <td>{appointment.status}</td>
//                   <td>
//                     <button onClick={() => navigate(`/appointments/edit/${appointment.id}`)}>Edit</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>No appointments found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppointmentManagement;
