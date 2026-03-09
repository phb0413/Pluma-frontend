<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/authApi';

const username = ref("");
const password = ref("");
const router = useRouter();

const handleLogin = async () => {

    try {
        await login(username.value, password.value)

        alert("로그인 성공!")

        router.push("/")
    } catch (error) {
        alert("로그인 실패")
    }
};
</script>

<template>
    <div>
        <h2>로그인</h2>

        <input v-model="username" placeholder="아이디" />
        <input v-model="password" type="password" placeholder="비밀번호" />

        <button @click="handleLogin">로그인</button>
    </div>
</template>