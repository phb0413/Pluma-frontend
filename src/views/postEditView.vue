<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPostDetail, updatePost } from '@/api/postApi';

const route = useRoute();
const router = useRouter();

const title = ref("");
const content = ref("");

const fetchPost = async () => {
    const res = await getPostDetail(route.params.id);

    title.value = res.data.title;
    content.value = res.data.content;
}

const submitEdit = async () => {
    try {
        await updatePost(route.params.id, {
            title: title.value,
            content: content.value
        });

        alert("수정 완료");
        router.push(`/posts/${route.params.id}`);
    } catch (err) {
        alert(err.response?.data || "수정 실패");
    }
}

onMounted(fetchPost)
</script>

<template>
    <h2>게시글 수정</h2>

    <div>
        <input v-model="title"/>
    </div>

    <div>
        <textarea v-model="content"></textarea>
    </div>

    <button @click="submitEdit">수정완료</button>
</template>