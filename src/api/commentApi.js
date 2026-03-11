import api from "./axios";

export const getCommentScroll = (postId, lastCommentId, size = 5) => {
    return api.get(`/posts/${postId}/comments/scroll`, {
        params: {
            lastCommentId,
            size
        }
    });
};

export const createComment = (postId, content) => {
    return api.post(`/posts/${postId}/comments`, {
        content
    });
};

export const updateComment = (commentId, content) => {
    return api.put(`/comments/${commentId}`, {
        content
    });
};

export const deleteComment = (commentId) => {
    return api.delete(`/comments/${commentId}`);
};