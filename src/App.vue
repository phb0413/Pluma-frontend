<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {refresh,logout as apiLogout} from "@/api/authApi";
import { useAccessToken } from "@/store/tokenStore";

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
  <div>
    <header style="display: flex; gap: 10px; margin-bottom: 20px;">
      <button @click="$router.push('/')">홈</button>

      <!-- login 안했을때 -->
      <button v-if="!accessToken" @click="$router.push('/login')">로그인</button>

      <button v-if="!accessToken" @click="$router.push('/signup')">회원가입</button>

      <!-- login 했을때-->
       <button v-if="accessToken" @click="$router.push('/write')">글쓰기</button>

       <button v-if="accessToken" @click="logout">로그아웃</button>

    </header>

    <!-- ⭐ 핵심: 이게 있어야 페이지 바뀜 -->
    <router-view />
  </div>
</template>