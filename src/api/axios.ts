import axios from "axios";

const isDev = window.location.hostname === "localhost";
const apiUrl = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: isDev ? apiUrl : '/api',
    headers: {
        'Content-Type': 'application/json',
    }
})