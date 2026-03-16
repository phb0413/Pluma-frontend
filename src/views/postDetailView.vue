<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";

import { getPostDetail, deletePost } from "@/api/postApi";
import { getCommentScroll, createComment, updateComment, deleteComment } from "@/api/commentApi";

import { useUsername } from "@/store/tokenStore";
import { toggleLike } from "@/api/likeApi";
import { marked } from "marked";
import CommonButton from "@/components/CommonButton.vue";

const route = useRoute();
const router = useRouter();

const likeCount = ref(0);
const liked = ref(false);

const post = ref(null);
const username = useUsername();

const comments = ref([]);

const lastCommentId = ref(null);
const loading = ref(false);
const finished = ref(false);

const observerTarget = ref(null);
let observer = null;

/* 댓글 작성 */

const newComment = ref("");

/* 댓글 수정 */

const editingCommentId = ref(null);
const editingContent = ref("");

/* 시간 포맷 함수 */
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(dateString));
};

/* 게시글 조회 */

const fetchPost = async () => {
  const res = await getPostDetail(route.params.id);
  post.value = res.data;

  likeCount.value = res.data.likeCount;
  liked.value = res.data.liked;
};

/* 댓글 조회 (무한스크롤 핵심) */

const fetchComments = async () => {

  if (loading.value || finished.value) return;

  loading.value = true;

  try {

    const res = await getCommentScroll(
      route.params.id,
      lastCommentId.value
    );

    const newComments = res.data.content;

    comments.value.push(...newComments);

    if (newComments.length > 0) {
      lastCommentId.value = newComments[newComments.length - 1].id;
    }

    finished.value = res.data.last;

  } catch (err) {

    console.error("댓글 불러오기 실패", err);

  } finally {

    loading.value = false;

  }

};

/* 댓글 작성 */

const submitComment = async () => {

  if (!newComment.value.trim()) return;

  try {

    await createComment(route.params.id, newComment.value);

    newComment.value = "";

    comments.value = [];
    lastCommentId.value = null;
    finished.value = false;

    await fetchComments();

  } catch (err) {

    alert("댓글 작성 실패");

  }

};

/* 댓글 수정 시작 */

const startEdit = (comment) => {

  editingCommentId.value = comment.id;
  editingContent.value = comment.content;

};

/* 댓글 수정 */

const submitEdit = async (commentId) => {

  try {

    await updateComment(commentId, editingContent.value);

    const target = comments.value.find(c => c.id === commentId);

    if (target) {
      target.content = editingContent.value;
    }

    editingCommentId.value = null;

  } catch (err) {

    alert("수정 실패");

  }

};

/* 댓글 삭제 */

const deleteCommentHandler = async (commentId) => {

  if (!confirm("삭제하시겠습니까?")) return;

  try {

    await deleteComment(commentId);

    comments.value = comments.value.filter(
      c => c.id !== commentId
    );

  } catch (err) {

    alert("삭제 실패");

  }

};

/* 게시글 수정 */

const editPost = () => {
  router.push(`/posts/edit/${post.value.id}`);
};

/* 게시글 삭제 */

const deletePostHandler = async () => {

  if (!confirm("삭제하시겠습니까?")) return;

  try {

    await deletePost(post.value.id);

    alert("삭제 완료");

    router.push("/");

  } catch (err) {

    alert(err.response?.data || "삭제 실패");

  }

};

/* 작성자 체크 */

const isAuthor = computed(() => {

  if (!post.value) return false;

  return username.value === post.value.author;

});

/* 댓글 작성자 체크 */

const isCommentAuthor = (comment) => {

  return username.value === comment.author;

};

/* 좋아요 클릭 */
const clickLike = async () => {

  try {

    const res = await toggleLike(post.value.id);

    likeCount.value = res.data;

    liked.value = !liked.value;

  } catch (err) {
    alert("조아요 실패");
  }
}

/* IntersectionObserver */

onMounted(() => {

  fetchPost();
  fetchComments();

  observer = new IntersectionObserver(

    (entries) => {

      if (entries[0].isIntersecting) {

        fetchComments();

      }

    },

    {

      root: null,
      rootMargin: "200px",
      threshold: 0

    }

  );

  if (observerTarget.value) {

    observer.observe(observerTarget.value);

  }

});
</script>

<template>
  <div class="post-detail-container">
    <article v-if="post" class="post-article">
      <header class="post-header">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-info">
          <span class="author">{{ post.author }}</span>
          <span class="separator">·</span>
          <span class="date">{{ formatDate(post.createdAt) }}</span>
          
          <div v-if="isAuthor" class="author-actions">
            <button class="text-btn" @click="editPost">수정</button>
            <button class="text-btn delete" @click="deletePostHandler">삭제</button>
          </div>
        </div>
      </header>

      <div class="post-content" v-html="marked(post.content)"></div>

      <div class="like-section">
        <button :class="['like-btn', { 'liked': liked }]" @click="clickLike">
          <span class="heart">{{ liked ? '❤️' : '🤍' }}</span>
          <span class="count">{{ likeCount }}</span>
        </button>
      </div>
    </article>

    <section class="comment-section">
      <h3>{{ comments.length }}개의 댓글</h3>
      
      <div class="comment-write">
        <textarea v-model="newComment" placeholder="댓글을 작성하세요" rows="3"></textarea>
        <div class="comment-submit">
          <CommonButton label="댓글 작성" variant="primary" @click="submitComment" />
        </div>
      </div>

      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <span class="comment-author">{{ comment.author }}</span>
            <div v-if="isCommentAuthor(comment)" class="comment-actions">
              <span @click="startEdit(comment)">수정</span>
              <span @click="deleteCommentHandler(comment.id)">삭제</span>
            </div>
          </div>

          <div v-if="editingCommentId === comment.id" class="comment-edit-form">
            <textarea v-model="editingContent" class="edit-textarea"></textarea>
            <div class="edit-btns">
              <CommonButton label="취소" variant="secondary" @click="editingCommentId = null" />
              <CommonButton label="저장" variant="primary" @click="submitEdit(comment.id)" />
            </div>
          </div>
          
          <div v-else class="comment-content">
            {{ comment.content }}
          </div>
        </div>
        
        <div ref="observerTarget" class="scroll-target">
          <p v-if="loading">댓글 불러오는 중...</p>
          <p v-if="finished && comments.length > 0">모든 댓글을 읽었습니다.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.post-detail-container {
  max-width: 768px; /* 가독성을 위한 최적 너비 */
  margin: 0 auto;
  padding: 3rem 0;
}

.post-header {
  margin-bottom: 3rem;
}

.post-title {
  font-size: 3rem;
  font-weight: 800;
  color: #212529;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.post-info {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #495057;
}

.author {
  font-weight: bold;
}

.separator {
  margin: 0 0.5rem;
}

.author-actions {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.text-btn {
  background: none;
  border: none;
  color: #868e96;
  cursor: pointer;
  font-size: 0.9rem;
}

.text-btn:hover { color: #212529; }
.text-btn.delete:hover { color: #fa5252; }

/* 본문 스타일 */
.post-content {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #212529;
  margin-bottom: 5rem;
}

.post-content :deep(img) { max-width: 100%; }

/* 좋아요 버튼 */
.like-section {
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;
}

.like-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border: 1px solid #dee2e6;
  padding: 10px 20px;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.2s;
}

.like-btn:hover { border-color: #212529; }
.like-btn.liked { border-color: #ff6b6b; background: #fff5f5; }

/* 댓글 섹션 */
.comment-section { margin-top: 5rem; }

.comment-write {
  margin: 1.5rem 0 3rem;
}

.comment-write textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  resize: none;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
}

.comment-submit {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.comment-item {
  padding: 1.5rem 0;
  border-bottom: 1px solid #f1f3f5;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.comment-author {
  font-weight: bold;
  color: #212529;
}

.comment-actions {
  font-size: 0.85rem;
  color: #868e96;
  display: flex;
  gap: 10px;
}

.comment-actions span { cursor: pointer; }
.comment-actions span:hover { text-decoration: underline; }

.comment-content {
  line-height: 1.6;
  color: #212529;
  white-space: pre-wrap;
}

/* 수정 폼 */
.edit-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  margin-bottom: 10px;
}
.edit-btns { display: flex; justify-content: flex-end; gap: 5px; }

.scroll-target {
  text-align: center;
  padding: 2rem;
  color: #868e96;
}
</style>