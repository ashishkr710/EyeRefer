import axios from "axios";
import { Local } from "../environment/env";

const api = axios.create({
    baseURL: Local.BASE_URL
});

export default api;