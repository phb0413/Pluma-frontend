import api from "./axios"

export const toggleLike = (postId) => {
    return api.post(`/posts/${postId}/like`);
};