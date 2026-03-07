import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:7080/api",
});

export const getCommentScroll = (postId, lastCommentId, size = 5) => {
    return api.get(`/posts/${postId}/comments/scroll`, {
        params: {
            lastCommentId,
            size
        }
    });
};