<script setup>
import {ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import { getPostsPaged, searchPosts } from "@/api/postApi";
import CommonButton from "@/components/CommonButton.vue";
import PostCard from "@/components/PostCard.vue";

const posts = ref([]);
const router = useRouter();

const page = ref(0);
const totalPages = ref(0);
const size = 5;

const keyword = ref("");
const searching = ref(false);

const fetchPosts = async () => {
    try {
        let res;

        if(searching.value && keyword.value) {
            res = await searchPosts(keyword.value, page.value, size);
        } else {
            res = await getPostsPaged(page.value, size);
        }

        posts.value = res.data.content;
        totalPages.value = res.data.totalPages;
    } catch (err) {
        console.log(err);
    }
};

// 시간 표기 수정
const formatDate = (dateString) => {

    if(!dateString) return ""; // data 없을 경우

    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24시간제 표기
    }).format(new Date(dateString));
};

const search = () => {
    page.value = 0;
    searching.value = true;
    fetchPosts();
}

const changePage = (p) => {
    page.value = p;
    fetchPosts();
}

// 게시글 상세 페이지 이동
const goDetail = (id) => {
    router.push(`/posts/${id}`);
}
// 게시글 목록 가져오기
onMounted(() => {
    fetchPosts();
});

</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <h1>최신 게시글</h1>
      
      <div class="search-bar">
        <input 
          v-model="keyword" 
          @keyup.enter="search"
          placeholder="검색어를 입력하세요..." 
          class="search-input"
        />
        <CommonButton label="검색" variant="primary" @click="search" />
      </div>
    </div>

    <div class="post-list" v-if="posts.length > 0">
      <PostCard 
        v-for="post in posts" 
        :key="post.id" 
        :post="post" 
        :formatDate="formatDate"
        @click="goDetail(post.id)"
      />
    </div>
    
    <div v-else class="no-posts">
      게시글이 없습니다.
    </div>

    <div class="pagination" v-if="totalPages > 0">
      <CommonButton 
        v-for="p in totalPages" 
        :key="p" 
        :label="String(p)"
        :variant="page === p - 1 ? 'primary' : 'secondary'"
        @click="changePage(p - 1)"
        class="page-btn"
      />
    </div>
  </div>
</template>

<style scoped>
.list-container {
  max-width: 800px; /*  약간 좁게  */
  margin: 0 auto;
}

.list-header {
  margin-bottom: 2rem;
}

.list-header h1 {
  font-size: 2rem;
  color: #212529;
  margin-bottom: 1.5rem;
}

.search-bar {
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #12b886;
}

.post-list {
  margin-top: 1rem;
}

.no-posts {
  padding: 5rem 0;
  text-align: center;
  color: #868e96;
}

.pagination {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  padding: 0;
}
</style>

