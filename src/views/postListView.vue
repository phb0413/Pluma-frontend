<script setup>
import {ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import { getPosts } from "@/api/postApi";

const posts = ref([]);
const router = useRouter();

// 게시글 목록 가져오기
onMounted(async () => {
    const response = await getPosts();
    posts.value = response.data.content ?? response.data;
});

// 게시글 상세 페이지 이동
const goDetail = (id) => {
    router.push(`/posts/${id}`);
}
</script>

<template>
    <div>
        <h1>게시글 목록입니당</h1>
        <ul>
            <li v-for="post in posts" :key="post.id" @click="goDetail(post.id)" style="cursor: pointer;">
                {{post.title }}
            </li>
        </ul>
    </div>
</template>

