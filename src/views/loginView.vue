<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/authApi';
import CommonButton from '@/components/CommonButton.vue'; // 공통 버튼 임포트

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
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title" @click="router.push('/')">PLUMA<span>.log</span></h2>
      <p class="login-subtitle">로그인이 필요한 서비스입니다.</p>

      <div class="form-group">
        <input 
          v-model="username" 
          placeholder="아이디를 입력하세요" 
          class="login-input"
          @keyup.enter="handleLogin"
        />
        <input 
          v-model="password" 
          type="password" 
          placeholder="비밀번호를 입력하세요" 
          class="login-input"
          @keyup.enter="handleLogin"
        />
      </div>

      <CommonButton 
        label="로그인" 
        variant="primary" 
        class="login-submit-btn" 
        @click="handleLogin" 
      />

      <div class="login-footer">
        <span>아직 회원이 아니신가요?</span>
        <button class="text-link" @click="router.push('/signup')">회원가입</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 페이지 중앙 정렬을 위한 컨테이너 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 5rem; /* 헤더 아래 여백 */
}

/* 로그인 박스 스타일 */
.login-box {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 3rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05); /* 부드러운 그림자 */
  text-align: center;
}

.login-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  cursor: pointer;
  color: #212529;
}

.login-title span {
  color: #12b886;
}

.login-subtitle {
  color: #868e96;
  margin-bottom: 2.5rem;
  font-size: 1rem;
}

/* 입력 필드 그룹 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1.5rem;
}

.login-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */
}

.login-input:focus {
  border-color: #12b886;
}

/* 로그인 버튼 너비 확장 */
.login-submit-btn {
  width: 100%;
  height: 3rem;
  font-size: 1.1rem !important;
}

/* 하단 가이드 문구 */
.login-footer {
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

.text-link:hover {
  color: #0ca678;
}
</style>