<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { createPost } from '@/api/postApi';

const router = useRouter();

const title = ref("");
const content = ref("");

const submitPost = async () => {

    try {
        await createPost({
            title: title.value,
            content: content.value
        });

        alert("게시글 작성 성공");

        router.push("/");
    } catch (err) {
        alert("작성 실패");
    }
}
</script>

<template>

    <h2>게시글 작성</h2>

    <div>
        <input v-model="title" placeholder="제목">
    </div>

    <div>
        <textarea v-model="content" placeholder="내용"></textarea>
    </div>

    <button @click="submitPost">작성</button>
</template>