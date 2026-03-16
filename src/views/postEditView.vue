<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPostDetail, updatePost } from '@/api/postApi';
import CommonButton from '@/components/CommonButton.vue';

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

    if (!title.value.trim() || !content.value.trim()) {
    alert("제목과 본문을 모두 입력해주세요.");
    return;
  }

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
  <div class="edit-container">
    <header class="edit-header">
      <input
        v-model="title"
        class="title-input"
        placeholder="제목을 입력하세요"
      />
      <div class="title-underline"></div>
    </header>

    <div class="editor-wrapper">
      <textarea 
        v-model="content" 
        class="content-textarea" 
        placeholder="당신의 이야기를 수정해보세요..."
      ></textarea>
    </div>

    <footer class="edit-footer">
      <div class="footer-content">
        <CommonButton 
          label="취소" 
          variant="secondary" 
          @click="router.back()" 
        />
        <div class="footer-right">
          <CommonButton 
            label="수정 완료" 
            variant="primary" 
            @click="submitEdit" 
          />
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.edit-container {
  max-width: 100%;
  background-color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 제목 영역 */
.edit-header {
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

.title-underline {
  width: 4rem;
  height: 6px;
  background: #12b886; /* 수정 페이지임을 알리는 민트색 포인트 */
  margin-bottom: 1.5rem;
}

/* 본문 영역 */
.editor-wrapper {
  flex: 1;
  display: flex;
  margin-bottom: 5rem;
}

.content-textarea {
  width: 100%;
  min-height: 500px;
  border: none;
  outline: none;
  font-size: 1.125rem;
  line-height: 1.7;
  color: #212529;
  resize: none;
  font-family: inherit;
}

/* 하단 고정 바 */
.edit-footer {
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
</style>