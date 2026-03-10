<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { signup, checkUsername, checkEmail } from '@/api/authApi';

const username = ref("");
const email = ref("");
const password = ref("");
const usernameMessage = ref("");
const emailMessage = ref("");

const router = useRouter();

// 아이디 실시간 체크
watch(username, async (newValue) => {

    if(newValue < 4) {
        usernameMessage.value = "아이디는 4자 이상 이어야 입니다";
        return;
    }

    const exists = await checkUsername(newValue)

    if(exists) {
        usernameMessage.value = "이미 존재하는 아이디";
    } else {
        usernameMessage.value = "사용 가능한 아이디";
    }
})

// 이메일 실시간 체크
watch (email, async (newValue) => {

    if(!newValue.includes("@")) {
        emailMessage.value = "올바른 이메일 형식이 아닙니다.";
        return;
    }

    const exists = await checkEmail(newValue);

    if(exists) {
        emailMessage.value = "이미 사용중인 이메일";
    } else {
        emailMessage.value = "사용 가능한 이메일";
    }
})

const handleSignup = async () => {

    try {
        const res = await signup(
            username.value,
            email.value,
            password.value
        )

        alert("회원가입 성공!");

        router.push("/login");
    } catch (error) {
        console.log(error);

        alert("회원가입 실패!");
    }
}


</script>

<template>
    <div>

        <h2>회원가입</h2>

        <input v-model="username" placeholder="아이디" />
        <p>{{ usernameMessage }}</p>

        <input v-model="email" placeholder="이메일" />
        <p>{{ emailMessage }}</p>

        <input v-model="password" placeholder="패스워드" />

        <button @click="handleSignup" :disabled="
        usernameMessage !=='사용 가능한 아이디' || emailMessage !== '사용 가능한 이메일'">회원가입</button>
    </div>
</template>