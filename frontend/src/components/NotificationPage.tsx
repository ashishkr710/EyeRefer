import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';
import './NotificationPage.css';
import { io } from 'socket.io-client';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  createdAt: string;
}

const NotificationPage: React.FC = () => {
  const socket = io("http://localhost:3000/");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('uuid');

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view notifications.');
        return;
      }

      try {
        socket.on('get_notification', (data: any) => {
          setNotifications((prevNotifications) => [data, ...prevNotifications]);
        });

        const response = await api.get(`/notifications/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setNotifications(response.data);
        } else {
          toast.error('Failed to fetch notifications.');
        }
      } catch (err: any) {
        toast.error('Error fetching notifications');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className='notificationContener'>
      <h3 className='notficationHead'>Notifications</h3>
      {loading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <ul className='notificationList'>
          {notifications.length === 0 && <h3 className='noNotification'>No new notifications.</h3>}
          {notifications.map((notification) => (
            <li key={notification.id} className={`notification ${notification.type}`}>
              <div className='notificationContent'>
                <p className='notificationMessage'>{notification.message}</p>
                <span className='notificationDate'>{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;