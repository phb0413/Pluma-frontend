<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {refresh,logout as apiLogout} from "@/api/authApi";
import { useAccessToken } from "@/store/tokenStore";
import CommonButton from "@/components/CommonButton.vue";


const router = useRouter();
const accessToken = useAccessToken();

const logout = async () => {
  await apiLogout();
  router.push("/");
};

onMounted(async () => {
  try {
    await refresh();
  } catch {
    console.log("로그인 안된 상태");
  }
});
</script>

<template>
  <div class="app-wraper">
    <header class="header">
      <div class="header-inner">
        <div class="logo" @click="router.push('/')">
          PLUMA<span>.log</span>
        </div>

        <nav class="nav">

          <template v-if="!accessToken">
            <CommonButton label="로그인" @click="router.push('/login')" />
            <CommonButton label="회원가입" variant="outline" @click="router.push('/signup')" />
          </template>

          <template v-if="accessToken">
            <CommonButton label= "새 글 작성" variant="primary" @click="router.push('/write')" />
            <CommonButton label= "로그아웃" variant="secondary" @click="logout" />
            <CommonButton label= "마이페이지" variant="secondary" @click="router.push('/mypage')" />
          </template>
        </nav>
      </div>
    </header>
    
    <main class="content-container">
      <router-view />
    </main>
  </div>
</template>

<style>
/* 전역 스타일 초기화 */
body {
  margin: 0;
  padding: 0;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Apple SD Gothic Neo", "Malgun Gothic", Arial, sans-serif;
}
</style>

<style scoped>
.app-wrapper {
  min-height: 100vh;
}

.header {
  height: 4rem;
  background: white;
  display: flex;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px; /* 부드러운 그림자 */
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-inner {
  width: 1200px;
  max-width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -1px;
  cursor: pointer;
  color: #212529;
}

.logo span {
  color: #12b886; /* 로고 포인트 컬러 */
}

.nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.content-container {
  width: 1200px;
  max-width: 90%;
  margin: 2rem auto;
}
</style>