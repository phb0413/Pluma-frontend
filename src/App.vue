<script setup>
import { ref } from "vue";

const isLogin = ref(false);
</script>

<template>
  <div>
    <header>
      <h1>Pluma</h1>
      <button v-if="!isLogin">로그인</button>
      <button v-else>글쓰기</button>
    </header>

    <!-- ⭐ 핵심: 이게 있어야 페이지 바뀜 -->
    <router-view />
  </div>
</template>