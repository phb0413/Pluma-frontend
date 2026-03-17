import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "@/store/tokenStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = getAccessToken()

    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    "http://localhost:7080/api/auth/refresh",
                    {},
                    {withCredentials: true}
                )

                const newAccessToken = res.data.accessToken;

                setAccessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (err) {
                clearAccessToken();

                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
    
)

export default api;