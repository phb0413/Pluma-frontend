import api from "./axios";
import { setAccessToken, clearAccessToken } from "@/store/tokenStore";

export const login = async (username, password) => {
    const res = await api.post("/auth/login", {
        username,
        password
    });

    const accessToken = res.data.accessToken;

    setAccessToken(accessToken);

    return res;
};

export const logout = async () => {
    await api.post("/auth/logout");

    clearAccessToken();
}

export const refresh = async () => {

    const res = await api.post("/auth/refresh");

    const accessToken = res.data.accessToken;

    setAccessToken(accessToken);

    return accessToken;
}

export const signup = async (username, email, password) => {

    const res = await api.post("/auth/signup", {
        username,
        email,
        password
    });

    return res;
}

export const checkUsername = async (username) => {
    const res = await api.get("/auth/check-username", {
        params: {username}
    });

    return res.data;
}

export const checkEmail = async (email) => {
    const res = await api.get("/auth/check-email", {
        params: {email}
    });

    return res.data;
}