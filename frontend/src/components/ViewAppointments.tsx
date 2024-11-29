import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Local } from "../environment/env";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import moment from "moment";
import "./ViewAppointment.css";

const AppointmentDetails: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getAppointmentDetails = async () => {
    try {
      console.log("Getting appointment details");
      const response = await api.get(
        `${Local.VIEW_APPOINTMENT}/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      toast.error("Failed to fetch appointment details");
      console.error(err);
    }
  };

  const {
    data: appointmentData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["appointmentDetails", appointmentId],
    queryFn: getAppointmentDetails,
  });
  console.log(appointmentData);
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (isLoading) {
    return (
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-danger">
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

  if (!appointmentData) {
    return <div>No appointment data available.</div>;
  }

  return (
    <div className="view-appointment-container">
      <h3 className="mb-4">Appointment Details</h3>
      <div className="appointment-details">
        <p>
          <strong>Appointment Date:</strong>{" "}
          {moment(appointmentData.appoinment.date).format("DD-MM-YYYY")}
        </p>
        <p>
          <strong>Type:{appointmentData.appoinment.type}</strong>
        </p>
        <p>
          <strong>
            Name:{appointmentData.patient.firstname}{" "}
            {appointmentData.patient.lastname}
          </strong>
        </p>
      </div>
      <button className="btn btn-primary mt-4" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default AppointmentDetails;
