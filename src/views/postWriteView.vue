<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { createPost } from '@/api/postApi';
import Editor from '@toast-ui/editor';
import "@toast-ui/editor/dist/toastui-editor.css";
import CommonButton from '@/components/CommonButton.vue'; // 공통 버튼 임포트

const router = useRouter();

const title = ref("");
const editorRef = ref(null);
let editor = null;

onMounted(() => {
    editor = new Editor({
        el: editorRef.value,
        height: "600px",
        initialEditType: "markdown",
        previewStyle: "vertical",
        placeholder: "당신의 이야기를 써주세요",
        theme: 'default'
    });
});

const submitPost = async () => {

    const content = editor.getMarkdown();

    if (!title.value.trim()) {
        alert("제목을 입력해주세요.");
        return;
    }

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
  <div class="write-container">
    <header class="write-header">
      <input
        v-model="title"
        class="title-input"
        placeholder="제목을 입력하세요"
      />
      <div class="title-underline"></div>
    </header>

    <div class="editor-wrapper">
      <div ref="editorRef"></div>
    </div>

    <footer class="write-footer">
      <div class="footer-content">
        <CommonButton 
          label="나가기" 
          variant="secondary" 
          @click="router.back()" 
        />
        <div class="footer-right">
          <CommonButton 
            label="작성하기" 
            variant="primary" 
            @click="submitPost" 
          />
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 전체 컨테이너: 헤더와 푸터를 제외한 영역 확보 */
.write-container {
  max-width: 100%;
  background-color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 제목 입력창 스타일 */
.write-header {
  padding: 2rem 0 1rem 0;
}

.title-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 2.75rem;
  font-weight: bold;
  color: #212529;
  padding: 0;
  margin-bottom: 0.5rem;
}

.title-input::placeholder {
  color: #adb5bd;
}

.title-underline {
  width: 4rem;
  height: 6px;
  background: #212529;
  margin-bottom: 1.5rem;
  border-radius: 1px;
}

/* 에디터 높이 조절 */
.editor-wrapper {
  margin-bottom: 5rem; /* 푸터 공간 확보 */
}

/* 하단 고정 바 스타일 */
.write-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4rem;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  z-index: 100;
}

.footer-content {
  width: 1200px;
  max-width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-right {
  display: flex;
  gap: 0.75rem;
}

/* Toast UI 에디터 내부 스타일 커스텀 */
:deep(.toastui-editor-defaultUI) {
  border: none !important;
}

:deep(.toastui-editor-toolbar) {
  background-color: #f8f9fa !important;
  border-bottom: 1px solid #e9ecef !important;
}
</style>