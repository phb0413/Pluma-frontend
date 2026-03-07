<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { getPostDetail } from "@/api/postApi";
import { getCommentScroll } from "@/api/commentApi";

const route = useRoute();
const post = ref(null);

const comments = ref([]);
const lastCommentId = ref(null);
const loading = ref(false);
const finished = ref(false);

const observerTarget = ref(null); // 감지할 요소

const fetchPost = async () => {
  const id = route.params.id;
  const res = await getPostDetail(id);
  post.value = res.data;
};

const fetchComments = async () => {

  if (loading.value || finished.value) return;

  loading.value = true;

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

  loading.value = false;
};

onMounted(() => {

  fetchPost();
  fetchComments();

  const observer = new IntersectionObserver(
  (entries) => {
    if(entries[0].isIntersecting){
        fetchComments();
    }
  },
  {
    rootMargin : "200px"
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

        <hr/>

        <h3>댓글</h3>
        
        <div v-for="comment in comments" :key="comment.id">
            <p>{{ comment.content }}</p>
            <small>{{ comment.author }}</small>
            <hr/>
        </div>

        <p v-if="loading">댓글 불러오는 중</p>
        <p v-if="finished">댓글 끝</p>

        <!-- ⭐ 여기 중요 -->
        <div ref="observerTarget" style="height:20px"></div>
    </div>
</template>



