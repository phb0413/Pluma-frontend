<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { signup, checkUsername, checkEmail } from '@/api/authApi';
import CommonButton from '@/components/CommonButton.vue';

const username = ref("");
const email = ref("");
const password = ref("");
const usernameMessage = ref("");
const emailMessage = ref("");

const router = useRouter();

// 아이디 실시간 체크
watch(username, async (newValue) => {

    if(newValue < 4) {
        usernameMessage.value = "아이디는 4자 이상 이어야 입니다.";
        return;
    }

    const exists = await checkUsername(newValue)

    if(exists) {
        usernameMessage.value = "이미 존재하는 아이디입니다.";
    } else {
        usernameMessage.value = "사용 가능한 아이디입니다.";
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
        emailMessage.value = "이미 사용중인 이메일입니다.";
    } else {
        emailMessage.value = "사용 가능한 이메일입니다.";
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
  <div class="auth-container">
    <div class="auth-box">
      <h2 class="auth-title" @click="router.push('/')">PLUMA<span>.log</span></h2>
      <p class="auth-subtitle">반갑습니다! 정보를 입력해주세요.</p>

      <div class="form-group">
        <div class="input-wrapper">
          <input v-model="username" placeholder="아이디" class="auth-input" />
          <p :class="['message', { 'success': usernameMessage === '사용 가능한 아이디입니다.' }]">
            {{ usernameMessage }}
          </p>
        </div>

        <div class="input-wrapper">
          <input v-model="email" placeholder="이메일" class="auth-input" />
          <p :class="['message', { 'success': emailMessage === '사용 가능한 이메일입니다.' }]">
            {{ emailMessage }}
          </p>
        </div>

        <div class="input-wrapper">
          <input v-model="password" type="password" placeholder="비밀번호" class="auth-input" />
        </div>
      </div>

      <CommonButton 
        label="회원가입" 
        variant="primary" 
        class="auth-submit-btn"
        :disabled="usernameMessage !== '사용 가능한 아이디입니다.' || emailMessage !== '사용 가능한 이메일입니다.' || !password"
        @click="handleSignup" 
      />

      <div class="auth-footer">
        <span>이미 계정이 있으신가요?</span>
        <button class="text-link" @click="router.push('/login')">로그인</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 4rem;
}

.auth-box {
  width: 100%;
  max-width: 450px;
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.auth-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  cursor: pointer;
  color: #212529;
}

.auth-title span {
  color: #12b886;
}

.auth-subtitle {
  color: #868e96;
  margin-bottom: 2.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 2rem;
}

.input-wrapper {
  text-align: left;
}

.auth-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.auth-input:focus {
  border-color: #12b886;
}

/* 유효성 검사 메시지 스타일 */
.message {
  font-size: 0.8rem;
  margin: 5px 0 0 5px;
  color: #fa5252; /* 기본값: 빨간색 (에러) */
}

.message.success {
  color: #12b886; /* 성공 시 민트색 */
}

.auth-submit-btn {
  width: 100%;
  height: 3.5rem;
  font-size: 1.1rem !important;
}

/* 버튼 비활성화 스타일  */
.auth-submit-btn:disabled {
  background-color: #e9ecef !important;
  color: #adb5bd !important;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #495057;
}

.text-link {
  background: none;
  border: none;
  color: #12b886;
  font-weight: bold;
  cursor: pointer;
  margin-left: 8px;
  text-decoration: underline;
}
</style>