/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { PiHouseLight } from "react-icons/pi";
import { MdOutlinePersonalInjury } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import { MdOutlineMarkChatRead } from "react-icons/md";
import { MdOutlinePersonPin } from "react-icons/md";
import { BiBell, BiBookReader } from "react-icons/bi";
import { LuLogOut } from "react-icons/lu";
import logoImg from '../logo1.png';
import arrowImg from '../arrow.png'; // Import the arrow image
import './Header.css';
import Notification from './Notefication'; // Import the Notification component

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const firstname = localStorage.getItem('firstname')
  const lastname = localStorage.getItem('lastname')

  const doctype: any = localStorage.getItem('doctype');

  const [showNotification, setShowNotification] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar visibility

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleBellClick = () => {
    navigate('/notifications'); // Navigate to the notification page
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header className="header-container">
        <div className="header-left">
        </div>

        <div className="header-right">
          <BiBell className='noteficationBell' onClick={handleBellClick} />
          <img
            src="avtar03.png"
            alt="Profile photo"
            className='header-profile-img'
            style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '-15px', marginTop: '-8px' }}
          />
          <div className="user-actions">
            {token ? (
              <div className="dropdown">
                <h6 className="dropdown-toggle" aria-expanded="false">
                  Hi, {firstname} {lastname}
                  <br className='welcome'></br>Welcome back
                </h6>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink to="/profile" className="dropdown-item">
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/update-password" className="dropdown-item">
                      Change Password
                    </NavLink>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        localStorage.clear();
                        navigate('/login');
                      }}
                    >
                      Logout <LuLogOut />
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <NavLink to="/login" className="btn login-btn">
                  Login
                </NavLink>
                <NavLink to="/" className="btn signup-btn">
                  Sign-up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      {showNotification && (
        <Notification message="You have new notifications!" type="info" />
      )}

      {token && (
        <div className={`sidebar bg-white ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-logo">
            <div onClick={handleLogoClick} className="logo">
              <img src={logoImg} alt="EyeRefer" className="logo1-img" />
              <span className='logo-text'>EYE REFER</span>
              <hr />
            </div>
          </div>

          <nav className="nav-links">
            <div className='nav-link'>
              <PiHouseLight className='house' />
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Dashboard
              </NavLink>
            </div>

            <div className='nav-link'>
              <MdOutlinePersonalInjury className='house' />
              <NavLink to="/patient" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Patient
              </NavLink>
            </div>

            {doctype === '1' && (
              <div className='nav-link'>
                <BiBookReader className='house' />
                <NavLink to="/appointment-list" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Appointment
                </NavLink>
              </div>
            )}

            <div className='nav-link'>
              <MdOutlinePersonPin className='house' />
              <NavLink to="/doctor" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Doctors
              </NavLink>
            </div>

            <div className='nav-link'>
              <MdOutlineMarkChatRead className='house' />
              <NavLink to="/chat" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Chat
              </NavLink>
            </div>

            <div className='nav-link'>
              <GrGroup className="house" />
              <NavLink to="/add-staff" className={({ isActive }: { isActive: boolean }) => isActive ? "nav-link active" : "nav-link"}>
                Staff
              </NavLink>
            </div>
          </nav>
          <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
            <img src={arrowImg} alt="Toggle Sidebar" className={`arrow-img ${isSidebarOpen ? 'open' : 'closed'}`} />
          </button>
        </div>
      )}

      <Outlet />
    </>
  );
};

export default Header;
