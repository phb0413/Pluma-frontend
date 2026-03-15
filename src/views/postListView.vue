<script setup>
import {ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import { getPostsPaged, searchPosts } from "@/api/postApi";

const posts = ref([]);
const router = useRouter();

const page = ref(0);
const totalPages = ref(0);
const size = 5;

const keyword = ref("");
const searching = ref(false);

const fetchPosts = async () => {
    try {
        let res;

        if(searching.value && keyword.value) {
            res = await searchPosts(keyword.value, page.value, size);
        } else {
            res = await getPostsPaged(page.value, size);
        }

        posts.value = res.data.content;
        totalPages.value = res.data.totalPages;
    } catch (err) {
        console.log(err);
    }
};

// 시간 표기 수정
const formatDate = (dateString) => {

    if(!dateString) return ""; // data 없을 경우

    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24시간제 표기
    }).format(new Date(dateString));
};

const search = () => {
    page.value = 0;
    searching.value = true;
    fetchPosts();
}

const changePage = (p) => {
    page.value = p;
    fetchPosts();
}

// 게시글 상세 페이지 이동
const goDetail = (id) => {
    router.push(`/posts/${id}`);
}
// 게시글 목록 가져오기
onMounted(() => {
    fetchPosts();
});

</script>

<template>
    <div>
        <h1>게시글 목록</h1>

        <!-- 검색 -->
        <div style="margin-bottom: 20px;">

            <input v-model="keyword" placeholder="검색어 입력" />

            <button @click="search">검색</button>
        </div>

        <table border = "1" width="100%">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="post in posts" :key="post.id" @click="goDetail(post.id)" style="cursor: pointer;">
                    <td>{{ post.id }}</td>
                    <td>{{ post.title }}</td>
                    <td>{{ post.author }}</td>
                    <td>{{ formatDate(post.createdAt) }}</td>
                </tr>
            </tbody>
        </table>

        <!-- 페이지네이션 -->
        
        <div style="margin-top: 20px;">

            <button v-for="p in totalPages" :key="p" @click="changePage(p-1)">
                {{ p }}
            </button>
        </div>
    </div>
</template>

