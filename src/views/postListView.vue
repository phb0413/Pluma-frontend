<script setup>
import {ref, onMounted} from "vue";
import { getPosts } from "@/api/postApi";

const posts = ref([]);

onMounted(async () => {
    const response = await getPosts();
    posts.value = response.data;
});
</script>

<template>
    <div>
        <h1>게시글 목록입니당</h1>
        <ul>
            <li v-for="post in posts" :key="post.id">
                {{post.title }}
            </li>
        </ul>
    </div>
</template>

