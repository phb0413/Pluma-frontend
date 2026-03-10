import { ref } from "vue";
import { jwtDecode } from "jwt-decode";

const accessToken = ref(null);
const username = ref(null);

export const setAccessToken = (token) => {
    accessToken.value = token;

    if(token) {
        const decoded = jwtDecode(token);

        username.value = decoded.sub;
    } else {
        username.value = null;
    }
};

export const getAccessToken = () => {
    return accessToken.value;
};

export const clearAccessToken = () => {
    accessToken.value = null;
};

export const useAccessToken = () => {
    return accessToken; 
}

export function useUsername() {
    return username;
}