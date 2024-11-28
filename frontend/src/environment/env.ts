interface config {
    GET_DOCTOR_LIST: any;
    CREATE_APPOINTMENT: any;
    GET_PATIENT_APPOINTMENTS: any;
    BASE_URL: string;
    CREATE_USER: string;
    VERIFY_USER: string;
    LOGIN_USER: string;
    GET_USER: string;
    GET_DOC_LIST: string;
    GET_PATIENT_LIST: string;
    ADD_PATIENT: string;
    ADD_ADDRESS: string;
    UPDATE_USER:string;
    CHANGE_PASSWORD:string;
    ADD_STAFF:string;
    GET_STAFF: string;
    DELETE_ADDRESS:any;
    UPDATE_ADDRESS:any;
    ADD_APPOINTMENT:any;
    GET_APPOINTMENT_LIST:any;
    GET_PATIENT_DETAILS:any;
}

export const Local: config = {
    BASE_URL: import.meta.env.VITE_BASE_URL,
    CREATE_USER: import.meta.env.VITE_CREATE_USER,
    VERIFY_USER: import.meta.env.VITE_VERIFY_USER,
    LOGIN_USER: import.meta.env.VITE_LOGIN_USER,
    GET_USER: import.meta.env.VITE_GET_USER,
    GET_DOC_LIST: import.meta.env.VITE_GET_DOC_LIST,
    GET_PATIENT_LIST: import.meta.env.VITE_GET_PATIENT_LIST,
    ADD_PATIENT: import.meta.env.VITE_ADD_PATIENT,
    ADD_ADDRESS: import.meta.env.VITE_ADD_ADDRESS,
    CREATE_APPOINTMENT: undefined,
    GET_PATIENT_APPOINTMENTS: undefined,
    GET_DOCTOR_LIST: import.meta.env.VITE_GET_DOCTOR_LIST,
    UPDATE_USER: import.meta.env.VITE_UPDATE_PROFILE,
    CHANGE_PASSWORD: import.meta.env.VITE_CHANGE_PASSWORD,
    ADD_STAFF: import.meta.env.VITE_ADD_STAFF,
    GET_STAFF: import.meta.env.VITE_GET_STAFF,
    DELETE_ADDRESS: import.meta.env.VITE_DELETE_ADDRESS,
    UPDATE_ADDRESS: import.meta.env.VITE_UPDATE_ADDRESS,
    ADD_APPOINTMENT:import.meta.env.VITE_ADD_APPOINTMENT,
    GET_APPOINTMENT_LIST:import.meta.env.VITE_GET_APPOINTMENT_LIST,
    GET_PATIENT_DETAILS:import.meta.env.VITE_GET_PATIENT_DETAILS
}