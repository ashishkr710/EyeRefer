import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Local } from "../environment/env";
import api from "../api/axiosInstance";
import "./UpdateAppointment.css";

const UpdateAppointment: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [initialValues, setInitialValues] = useState({
    appointmentDate: "",
    appointmentType: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const validationSchema = Yup.object({
    appointmentDate: Yup.date().required("Appointment date is required"),
    appointmentType: Yup.string()
      .oneOf(["Consultation", "Surgery"], "Invalid appointment type")
      .required("Appointment type is required"),
  });

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await api.get(
          `${Local.GET_APPOINTMENT}/${appointmentId}`
          ,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { appoinment } = response.data;
        setInitialValues({
          appointmentDate: appoinment.date || "",
          appointmentType: appoinment.type || "",
        });
      } catch (error) {
        toast.error("Failed to fetch appointment details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchAppointmentDetails();
    } else {
      navigate("/login");
    }
  }, [appointmentId, token, navigate]);

  // Submit handler for the form
  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await api.put(
        `${Local.UPDATE_APPOINTMENT}/${appointmentId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || "Appointment updated successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to update appointment");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  return (
    <div className="update-appointment-container">
      <h3 className="mb-4">Update Appointment</h3>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
            <Form className="form-container">
            <div className="form-group mb-3">
              <label htmlFor="appointmentDate">Appointment Date</label>
              <Field
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              className="form-control"
              min={new Date().toISOString().split("T")[0]} 
              />
              <ErrorMessage
              name="appointmentDate"
              component="div"
              className="text-danger"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="appointmentType">Appointment Type</label>
              <Field
                as="select"
                id="appointmentType"
                name="appointmentType"
                className="form-control"
              >
                <option value="">Select type</option>
                <option value="Consultation">Consultation</option>
                <option value="Surgery">Surgery</option>
              </Field>
              <ErrorMessage
                name="appointmentType"
                component="div"
                className="text-danger"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Appointment"}
            </button>
          </Form>
        )}
      </Formik>
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default UpdateAppointment;