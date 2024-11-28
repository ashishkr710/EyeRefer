 
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { Local } from '../environment/env';
import AddAddress from './AddAddress';
import UpdateAddress from './UpdateAddress'; // Import UpdateAddress component
import { AiOutlineDelete } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import './Profile.css';
// import { BiUnderline } from 'react-icons/bi';

interface Address {
  uuid: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  title: string;
}

interface User {
  uuid: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  doctype: number;
  gender: string;
  Addresses?: Array<Address>;
}

interface ProfileData {
  user: User;
  message: string;
  patientCount?: number;
  referredPatients?: Array<any>;
  referredDoctors?: Array<any>;
  additionalData?: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showUpdateAddressModal, setShowUpdateAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null); // To store the selected address for update
  const [formData, setFormData] = useState<User | null>(null);

  const handleDelete = (addressUuid: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }
    axios
      .delete(`${Local.BASE_URL}${Local.DELETE_ADDRESS}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setProfile((prevProfile) => ({
          ...prevProfile!,
          user: {
            ...prevProfile!.user,
            Addresses: prevProfile!.user.Addresses?.filter(
              (address) => address.uuid !== addressUuid
            ),
          },
        }));
        toast.success('Address deleted successfully!');
      })
      .catch((err) => {
        console.error('Error deleting address:', err);
        toast.error('Error deleting address!');
      });
  };

  const handleOpenEditModal = () => {
    if (profile) {
      setFormData({ ...profile.user });
    }
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleOpenAddAddressModal = () => setShowAddAddressModal(true);
  const handleCloseAddAddressModal = () => setShowAddAddressModal(false);

  const handleOpenUpdateAddressModal = (address: Address) => {
    setSelectedAddress(address); // Set the selected address
    setShowUpdateAddressModal(true); // Open the update address modal
  };

  const handleCloseUpdateAddressModal = () => setShowUpdateAddressModal(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    axios
      .get(`${Local.BASE_URL}${Local.GET_USER}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching profile');
        setLoading(false);
      });
  }, []);

  const handleProfileSubmit = () => {
    const token = localStorage.getItem('token');
    if (!token || !formData) return;

    axios
      .post(
        `${Local.BASE_URL}${Local.UPDATE_USER}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setProfile((prev) => ({
          ...prev!,
          user: formData,
        }));
        setShowEditModal(false);
        alert('Profile updated successfully');
      })
      .catch((err) => {
        console.error(err);
        alert('Error updating profile');
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return null;

  const { user } = profile;

  return (
    <div className="profile-container">
      <div>
        <p className='fw-bold' style={{color:"black"}}>Profile</p>
      </div>
      <div className='profile'>
        <div className='profile-photo-heading'>
          <div>
            <img
              src="avatar.avif"
              alt="Profile photo"
              className="googleIcon-4"
            />{user.firstname} {user.lastname}</div>
          <button onClick={handleOpenEditModal} className="btn btn-primary mb-4">
            Edit Profile
          </button>
        </div>

        <div className="profile-info2">
          <div className='info'style={{marginBottom:15}}>
            <div>
              <span className='infoheading' >Name: </span>{user.firstname} {user.lastname}
            </div>
            <div className='gender-center'><span className='infoheading'>Gender:{user.gender}</span></div>
          </div>

          <div className='info'>
            <div><span className='infoheading'>Phone:</span> {user.phone}</div>
            <div className='email-center'><span className='infoheading'>Email:</span> {user.email}</div>
          </div>

          <div className='insurance-top'>
          <a href="#" className='insurance' style={{ marginTop: 20, textDecoration: 'underline' }}>Insurance Details</a>

          </div>

        </div>
        <div className='address-heading'>
          <button onClick={handleOpenAddAddressModal} className="btn btn-addAddress mb-4">
            Add Address
          </button>
        </div>

        <div className='address-info'>

          <p>
            <span className="fw-medium">Address Information</span>
            <div className='address-data'>

              {/* <p className="fw-bold">Work</p> */}
              {user.Addresses?.map((add, index) => (
                <div key={index} className='address-data-img'><span className='address-title'>{`${add.title}`}
                  <BsPencilSquare onClick={() => handleOpenUpdateAddressModal(add)}
                    className='profile-icon' />
                  <AiOutlineDelete onClick={() => handleDelete(add.uuid)} className='profile-icon' /> <br></br></span>
                  {`${add.street}`}<br></br>{`${add.city}`}<br></br> {`${add.state}`}<br></br> {`${add.pincode}`}

                  {/* <hr className='horizontal-line'></hr> */}
                  {/* <button
                    onClick={() => handleOpenUpdateAddressModal(add)}
                    // src="update.png"
                    // alt="Update Address"
                    className="btn btn-addAddress"
                  >Update</button>*/}
                  {/* <button
                    onClick={() => handleDelete(add.uuid)}
                      src="delete.png"
                       alt="Delete Address"
                    className="btn btn-addAddress"
                  >Delete</button> */}
                  <div className='line'></div>
                </div>
              ))}
            </div>

          </p>

          {/* <p>Type: {user.doctype === 2 ? 'OD' : 'MD'}</p> */}

          {/* Edit Profile Modal */}
          <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {formData && (
                <Form>
                  <Form.Group controlId="firstname">
                    <Form.Label>First Name<span className='star'>*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="lastname">
                    <Form.Label>Last Name<span className='star'>*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      disabled
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="phone">
                    <Form.Label>Phone<span className='star'>*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="gender">
                    <Form.Label>Gender<span className='star'>*</span></Form.Label>
                    <Form.Control
                      as="select"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="Male">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Control>
                  </Form.Group>

                </Form>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEditModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleProfileSubmit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Add Address Modal */}
          <Modal show={showAddAddressModal} onHide={handleCloseAddAddressModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add New Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddAddress close={handleCloseAddAddressModal} />
            </Modal.Body>
          </Modal>

          {/* Update Address Modal */}
          <Modal show={showUpdateAddressModal} onHide={handleCloseUpdateAddressModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Update Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedAddress && (
                <UpdateAddress address={selectedAddress} close={handleCloseUpdateAddressModal} />
              )}
            </Modal.Body>
          </Modal>

          {/* Add ToastContainer for global toast notifications */}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Profile;

