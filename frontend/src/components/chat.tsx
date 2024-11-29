// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Local } from '../environment/env';
// import './Chat.css';

// interface Message {
//   sender: string;
//   content: string;
//   timestamp: string;
// }

// interface ChatProps {
//   patientId: string;
// }

// const Chat: React.FC<ChatProps> = ({ patientId }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState<string>('');

//   useEffect(() => {
//     // Fetch chat messages for the patient
//     axios.get(`${Local.BASE_URL}/chat/${patientId}`)
//       .then(response => setMessages(response.data))
//       .catch(error => console.error('Error fetching chat messages:', error));
//   }, [patientId]);

//   const handleSendMessage = () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     const message = {
//       sender: 'OD', // or 'MD', depending on the user role
//       content: newMessage,
//       timestamp: new Date().toISOString(),
//     };

//     axios.post(`${Local.BASE_URL}/chat/${patientId}`, message, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(response => {
//         setMessages([...messages, response.data]);
//         setNewMessage('');
//       })
//       .catch(error => console.error('Error sending message:', error));
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={`chat-message ${msg.sender}`}>
//             <span className="chat-sender">{msg.sender}</span>
//             <span className="chat-content">{msg.content}</span>
//             <span className="chat-timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
//           </div>
//         ))}
//       </div>
//       <div className="chat-input">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;