import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import io from "socket.io-client";
import "./Chat.css";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";

const socket = io("http://localhost:3000/");

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const chatdata = JSON.parse(localStorage.getItem("chatdata") || "{}");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const direct = Object.keys(chatdata).length;
  const pname = localStorage.getItem('pname');

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    function fetchChats() {
      socket.emit("joinchat", chatdata);

      socket.on("prev_msg", async (data: any) => {
        setMessages([]);
        await data.map((metadata: any) =>
          setMessages((prev: any) => [...prev, metadata])
        );
      });
    }
    fetchChats();

    return () => {
      localStorage.removeItem("chatdata");
      socket.off("prev_msg");
    };
  }, []);

  const getRooms = async () => {
    try {
      const response = await api.get(`${Local.GET_ROOM}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  const { data: rooms, error, isLoading, isError } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms
  })

  useEffect(() => {
    socket.on("getRoom", (getRoom) => {
      localStorage.setItem("room", getRoom);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("new_message", (data: any) => {
      setMessages((prev: any) => [...prev, data]);
    });
  }, [socket]);

  const openChat = (patient: any, doc1: any, doc2: any, user: any, pfirstname: string, plastname: string) => {
    const chatData = { patient, user1: doc1, user2: doc2, user };
    localStorage.setItem("chatdata", JSON.stringify(chatData));
    const n = `${pfirstname} ${plastname}`;
    localStorage.setItem("pname", n);

    setMessages([]);
    setActiveRoom(patient); 

    socket.emit("joinchat", chatData);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "") {
      toast.warn("Please Enter Message");
    } else {
      const receiver =
        chatdata.user !== chatdata.user1 ? chatdata.user1 : chatdata.user2;

      const data = {
        sender: chatdata.user,
        message: newMessage.trim(),
        receiver: receiver,
        room: localStorage.getItem("room"),
      };
      socket.emit("send_message", data);
      setNewMessage("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (rooms) {
      const filteredRooms = rooms.room.filter((room: any) =>
        room.patient.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.patient.lastname.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRooms(filteredRooms);
    }
  };

  const groupMessagesByDate = (messages: any[]) => {
    const groupedMessages: { [key: string]: any[] } = {};
    messages.forEach((message) => {
      const date = new Date(message.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(message);
    });
    return groupedMessages;
  };

  const groupedMessages = groupMessagesByDate(messages);

  if (isLoading) {
    return (
      <>
        <div className='loading-icon'>
          <div className="spinner-border spinner text-primary me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className='me-2 fs-2'>Loading...</div>
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <div>Error: {error?.message}</div>
      </>
    )
  }

  return (
    <>
      <div className="chat-layout">
        <div className="chat-sidebar">
          <h4 style={{ margin: "10px" }}>Chat</h4>
          <input
            type="text"
            className="search-bar"
            placeholder="Search Patient"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          <div className="chat-patient-list">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room: any) => (
                <div
                  key={room.patient.uuid}
                  className={`patient-item ${activeRoom === room.patient.uuid ? 'active' : ''} mb-2`}
                  onClick={() => {
                    openChat(room?.patient?.uuid, room?.doc1?.uuid, room?.doc2?.uuid, rooms?.user?.uuid, room?.patient?.firstname, room?.patient?.lastname)
                  }}
                >
                  <h5>{room.name}</h5>
                  <p>{room.doc1.uuid !== rooms.user.uuid && (
                    <>
                      {room.doc1.firstname} {room.doc1.lastname}
                    </>
                  )}

                    {room.doc2.uuid !== rooms.user.uuid && (
                      <>
                        {room.doc2.firstname} {room.doc2.lastname}
                      </>
                    )}
                  </p>
                </div>
              ))
            ) : (
              rooms?.room?.map((room: any) => (
                <div
                  key={room.patient.uuid}
                  className={`patient-item ${activeRoom === room.patient.uuid ? 'active' : ''} mb-2`}
                  onClick={() => {
                    openChat(room?.patient?.uuid, room?.doc1?.uuid, room?.doc2?.uuid, rooms?.user?.uuid, room?.patient?.firstname, room?.patient?.lastname)
                  }}
                >
                  <h5>{room.name}</h5>
                  <p>{room.doc1.uuid !== rooms.user.uuid && (
                    <>
                      {room.doc1.firstname} {room.doc1.lastname}
                    </>
                  )}

                    {room.doc2.uuid !== rooms.user.uuid && (
                      <>
                        {room.doc2.firstname} {room.doc2.lastname}
                      </>
                    )}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {direct !== 0 && (
          <>
            <div className="chat-main">
              <div className="chat-header">
                <h4>{pname}</h4>
              </div>

              <div className="chat-messages mb-5">
                {Object.keys(groupedMessages).map((date) => (
                  <div key={date}>
                    <div className="date-divider">
                      <span>{date}</span>
                    </div>
                    {groupedMessages[date].map((msg: any, index: number) => (
                      <div
                        key={index}
                        className={`chat-bubble ${msg.sender_id === chatdata.user ? "chat-sent" : "chat-received"}`}
                      >
                        <p>{msg.message}</p>
                        <span className="message-timestamp"> {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="chat-input-container">
                <input
                  type="text"
                  className="chat-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={handleKeyPress}
                />
                <button className="chat-send-button" onClick={sendMessage}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-send"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Chat;
