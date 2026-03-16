import api from "./axios";

// 게시글 목록
export const getPosts = () => {
    return api.get("/posts");
};

// 게시글 상세
export const getPostDetail = (id) => {
    return api.get(`/posts/${id}`);
};

// 게시글 작성
export const createPost = (data) => {
    return api.post("/posts", data);
};

// 게시글 수정
export const updatePost = (id, data) => {

    return api.put(`/posts/${id}`, data)
};

// 게시글 삭제
export const deletePost = (id) => {
    return api.delete(`/posts/${id}`);
};

// 게시글 페이지네이션
export const getPostsPaged = (page = 0, size = 5) => {
    return api.get("/posts/paged", {
        params: {page,size}
    });
};

// 게시글 검색
export const searchPosts = (keyword, page = 0, size = 5) => {
    return api.get("/posts/search", {
        params: {keyword, page, size}
    });
};

// 내가 쓴 게시글 호출
export const getMyPosts = (page = 0, size = 5) => {
    return api.get(`/posts/my`, {
        params: { page, size }
    });
};
