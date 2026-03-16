<script setup>
defineProps({
  label: { type: String, required: true },
  variant: { 
    type: String, 
    default: 'secondary' // primary(민트), secondary(투명), outline(테두리)
  }
});

defineEmits(['click'])
</script>

<template>
    <button class="common-btn", `btn-${variant}` @click="$emit('click')">
        {{ label }}
    </button>
</template>

<style scoped>
.common-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  border: none;
  transition: all 0.125s ease-in 0s;
  border-radius: 1.5rem; /* 둥근 캡슐 형태 */
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
}

/* Primary: 글쓰기, 회원가입 (민트색) */
.btn-primary {
  background: #12b886;
  color: white;
}
.btn-primary:hover {
  background: #20c997; /* 살짝 밝아짐 */
}

/* Secondary: 로그인 (회색 텍스트) */
.btn-secondary {
  background: transparent;
  color: #212529;
}
.btn-secondary:hover {
  color: #868e96;
}

/* Outline: 로그아웃 (검은 테두리) */
.btn-outline {
  background: white;
  color: #212529;
  border: 1px solid #212529;
}
.btn-outline:hover {
  background: #212529;
  color: white;
}

/* 클릭했을 때 꾹 눌리는 효과 */
.common-btn:active {
  transform: translateY(1px);
}
</style>