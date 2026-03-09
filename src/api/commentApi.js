import api from "./axios";

export const getCommentScroll = (postId, lastCommentId, size = 5) => {
    return api.get(`/posts/${postId}/comments/scroll`, {
        params: {
            lastCommentId,
            size
        }
    });
};