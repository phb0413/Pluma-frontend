<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { createPost } from '@/api/postApi';
import Editor from '@toast-ui/editor';
import "@toast-ui/editor/dist/toastui-editor.css";

const router = useRouter();

const title = ref("");
const editorRef = ref(null);
let editor = null;

onMounted(() => {
    editor = new Editor({
        el: editorRef.value,
        height: "500px",
        initialEditType: "markdown",
        previewStyle: "vertical",
        placeholder: "velog처럼 글 써보기"
    });
});

const submitPost = async () => {

    const content = editor.getMarkdown();

    try {
        await createPost({
            title: title.value,
            content: content
        });

        alert("게시글 작성 성공");

        router.push("/");
    } catch (err) {
        alert("작성 실패");
    }
}
</script>

<template>

<div>

<h2>게시글 작성</h2>

<input
v-model="title"
placeholder="제목"
style="width:100%; margin-bottom:10px"
/>

<div ref="editorRef"></div>

<br>

<button @click="submitPost">
작성
</button>

</div>
</template>