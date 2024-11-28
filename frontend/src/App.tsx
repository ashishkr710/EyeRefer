import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import AddPatient from './components/AddPatient';
import DoctorList from './components/DoctorList';
import AddStaff from './components/AddStaff';
import Signup from './components/Signup';
import Header from './components/Header';
import Verify from './components/Verify';
import Login from './components/Login';
import Profile from './components/Profile';
import AddAddress from './components/AddAddress';
import Chat from './components/chat';
import AddAppointment from './components/AddAppoinments';
import UpdatePassword from './components/UpdatePassword';
import UpdateAddress from './components/UpdateAddress';
import AppointmentList from './components/AppointmentList';
import NotificationPage from './components/NotificationPage'; // Import the NotificationPage component

import './App.css';
import PatientDetails from './components/PatientsDetails';


const App: React.FC = () => {
  const router = createBrowserRouter([
    { path: '/', element: <Signup /> },
    { path: '/Verify', element: <Verify /> },
    { path: '/login', element: <Login /> },
    {
      path: '/', 
      element: <Header />,
      children: [
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/patient', element: <PatientList /> },
        { path: '/add-patient', element: <AddPatient /> },
        { path: '/doctor', element: <DoctorList /> },
        { path: '/add-staff', element: <AddStaff /> },
        { path: '/add-address', element: <AddAddress close={function (): void {
          throw new Error('Function not implemented.');
        } } /> },
        { path: '/update-address', element: <UpdateAddress /> },
        { path: '/profile', element: <Profile /> },
        { path: '/chat', element: <Chat /> },
        { path: '/add-appointment', element: <AddAppointment /> },
        { path: '/update-password', element: <UpdatePassword /> },
        { path: '/appointment-list', element: <AppointmentList /> },
        {path:'/patients-details/:patientId',element:<PatientDetails/>},
        { path: '/notifications', element: <NotificationPage /> } // Add the new route
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer newestOnTop={false} closeOnClick />
    </>
  );
};

export default App;
