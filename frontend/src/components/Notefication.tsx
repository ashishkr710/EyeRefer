import React from 'react';
import './Notification.css'; // Assuming you have some CSS for styling

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
    return (
        <div className={`notification ${type}`}>
            {message}
        </div>
    );
};

export default Notification;