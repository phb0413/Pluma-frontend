<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";

import { getPostDetail, deletePost } from "@/api/postApi";
import { getCommentScroll, createComment, updateComment, deleteComment } from "@/api/commentApi";

import { useUsername } from "@/store/tokenStore";
import { toggleLike } from "@/api/likeApi";

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

<div>

<h2>게시글 상세</h2>

<div v-if="post">

<h3>{{ post.title }}</h3>

<p>{{ post.content }}</p>

<p>작성자 : {{ post.author }}</p>

</div>

<div v-if="isAuthor">

<button @click="editPost">수정</button>

<button @click="deletePostHandler">삭제</button>

</div>

<button @click="clickLike">

<span v-if="liked">❤️</span>

<span v-else>🤍</span>

{{ likeCount }}

</button>

<hr/>

<h3>댓글 작성</h3>

<textarea v-model="newComment" rows="3"></textarea>

<br>

<button @click="submitComment">
댓글 작성
</button>

<hr/>

<h3>댓글</h3>

<!-- 댓글 스크롤 영역 -->

<div
style="
max-height:400px;
overflow-y:auto;
border:1px solid #ddd;
padding:10px;
"
>

<div
v-for="comment in comments"
:key="comment.id"
>

<!-- 수정 모드 -->

<div v-if="editingCommentId === comment.id">

<textarea v-model="editingContent"></textarea>

<br>

<button @click="submitEdit(comment.id)">
저장
</button>

<button @click="editingCommentId = null">
취소
</button>

</div>

<!-- 일반 모드 -->

<div v-else>

<p>{{ comment.content }}</p>

<small>{{ comment.author }}</small>

<div v-if="isCommentAuthor(comment)">

<button @click="startEdit(comment)">
수정
</button>

<button @click="deleteCommentHandler(comment.id)">
삭제
</button>

</div>

</div>

<hr/>

</div>

<p v-if="loading">댓글 불러오는 중...</p>

<p v-if="finished">댓글 끝</p>

<div ref="observerTarget" style="height:20px"></div>

</div>

</div>

</template>