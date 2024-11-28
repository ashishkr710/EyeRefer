/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './UpdatePassword.css'; // Optional: Add custom CSS for styling

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const handleCancel = () => {
    navigate('/dashboard')
  }
  // Local state for old and new passwords
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      setLoading(true);

      // Make API call to change password
      const response = await api.post(
        `${Local.CHANGE_PASSWORD}`,
        { currentPassword: oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="update-password-container">
      <div className='update-password'>

        <h3 className="update-password-title">Change Password</h3>

        <form onSubmit={handleSubmit} className="update-password-form">
          <div className="form-group3">
            <label htmlFor="old-password">Old Password<span className='star'>*</span></label>
            <input
              type="password"
              id="old-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="form-control"
              placeholder="old Password"
            />
          </div>

          <div className="form-group3">
            <label htmlFor="new-password">New Password<span className='star'>*</span></label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="form-control"
              placeholder="new Password"
            />
          </div>

          <div className="form-group3">
            <label htmlFor="confirm-password">Confirm New Password<span className='star'>*</span></label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-control"
              placeholder="Confirm Password"
            />
          </div>
          <div className='btn-reset'>
            <button onClick={handleCancel} className='cancel-btn btn btn-outline-success'>Cancel</button>
            <button type="submit" className="password-btn btn btn-info " disabled={loading}>
              Change Password
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default UpdatePassword;
