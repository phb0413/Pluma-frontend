<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMyPosts } from '@/api/postApi';
import { useUsername } from '@/store/tokenStore';
import PostCard from '@/components/PostCard.vue';
import CommonButton from '@/components/CommonButton.vue';

const router = useRouter();
const username = useUsername();

const posts = ref([]);
const currentPage = ref(0);
const totalPages = ref(0);
const totalElements = ref(0);
const loading = ref(false);

const fetchMyPosts = async (page = 0) => {
    loading.value = true;
    try {
        const res = await getMyPosts(page, 5); // 한 페이지에 5개씩
        posts.value = res.data.content;
        totalPages.value = res.data.totalPages;
        totalElements.value = res.data.totalElements;
        currentPage.value = page;
    } catch (error) {
        console.error("내 글 로드 실패:", error);
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

onMounted(() => {
    fetchMyPosts();
});
</script>

<template>
    <div class="mypage-container">
        <header class="profile-section">
            <div class="profile-circle">
                {{ username?.charAt(0).toUpperCase() }}
            </div>
            <div class="profile-info">
                <h2 class="profile-username">{{ username }}</h2>
                <p class="profile-bio">안녕하세요, {{ username }}님의 개인 블로그 공간입니다.</p>
                <div class="profile-stats">
                    작성한 포스트 <b>{{ totalElements }}</b>개
                </div>
            </div>
        </header>

        <hr class="divider" />

        <section class="posts-section">
            <h3 class="section-title">내 포스트</h3>
            
            <div v-if="posts.length > 0" class="post-list">
                <PostCard 
                    v-for="post in posts" 
                    :key="post.id" 
                    :post="post" 
                    :formatDate="formatDate"
                    @click="router.push(`/posts/${post.id}`)"
                />
            </div>

            <div v-else-if="!loading" class="empty-state">
                <p>작성된 포스트가 없습니다. 당신의 첫 이야기를 시작해보세요!</p>
                <CommonButton label="첫 글 쓰기" variant="primary" @click="router.push('/write')" />
            </div>

            <div v-if="totalPages > 1" class="pagination">
                <button 
                    :disabled="currentPage === 0" 
                    @click="fetchMyPosts(currentPage - 1)"
                    class="page-btn"
                >이전</button>
                <span class="page-info">{{ currentPage + 1 }} / {{ totalPages }}</span>
                <button 
                    :disabled="currentPage + 1 === totalPages" 
                    @click="fetchMyPosts(currentPage + 1)"
                    class="page-btn"
                >다음</button>
            </div>
        </section>
    </div>
</template>

<style scoped>
.mypage-container {
    max-width: 768px;
    margin: 0 auto;
    padding: 4rem 1rem;
}

/* 프로필 스타일 */
.profile-section {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 3rem;
}

.profile-circle {
    width: 120px;
    height: 120px;
    background: #f1f3f5;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    font-weight: 800;
    color: #12b886;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.profile-username {
    font-size: 2.25rem;
    font-weight: 800;
    margin: 0;
}

.profile-bio {
    color: #868e96;
    margin: 0.5rem 0 1rem;
}

.profile-stats {
    font-size: 0.95rem;
    color: #495057;
}

.divider {
    border: none;
    border-top: 1px solid #e9ecef;
    margin: 2rem 0 3rem;
}

/* 포스트 리스트 */
.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
}

.empty-state {
    text-align: center;
    padding: 5rem 0;
    color: #adb5bd;
}

/* 페이징 */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin-top: 3rem;
}

.page-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #dee2e6;
    background: white;
    cursor: pointer;
    border-radius: 4px;
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-info {
    font-weight: bold;
    color: #495057;
}
</style>