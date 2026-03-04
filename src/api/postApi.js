import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:7080", 
});

export const getPosts = () => {
    return api.get("/api/posts");
};

export const getPostDetail = (id) => {
    return api.get(`/api/posts/${id}`);
}