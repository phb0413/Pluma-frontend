import api from "./axios";

export const getPosts = () => {
    return api.get("/posts");
};

export const getPostDetail = (id) => {
    return api.get(`/posts/${id}`);
}