import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';
import './Notification.css';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  createdAt: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view notifications.');
        return;
      }

      try {
        const response = await api.get('/notifications', {
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
      <h1 className='notficationHead'>Notifications</h1>
      {loading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <ul className='notificationList'>
          {notifications.map((notification) => (
            <li key={notification.id} className={`notification ${notification.type}`}>
              <p>{notification.message}</p>
              <span className='notificationDate'>{new Date(notification.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;