import { ref } from "vue";

const accessToken = ref(null);

export const setAccessToken = (token) => {
    accessToken.value = token; 
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