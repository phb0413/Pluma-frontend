<script setup>
import {useRoute} from "vue-router";
import { onMounted, ref } from "vue";
import {getPostDetail} from "@/api/postApi";

const route = useRoute();
const post = ref(null);

const fetchPost = async () => {
    const id = route.params.id;
    const res = await getPostDetail(id);
    post.value = res.data;
};

onMounted(fetchPost);
</script>

<template>
    <div>
        <h2>게시글 상세</h2>
        <p>ID: {{ route.params.id }}</p>
        <div v-if="post">
            <h3>{{ post.title }}</h3>
            <p>{{ post.content }}</p>
            <p>작성자 : {{ post.author }}</p>
        </div>

        <div v-else>
            로딩중...
        </div>
    </div>
</template>



