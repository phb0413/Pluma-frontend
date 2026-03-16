<script setup>
defineProps({
    post: Object,
    formatDate: Function
});
defineEmits(['click']);
</script>

<template>
  <div class="post-card" @click="$emit('click')">
    <div class="post-info">
      <h2 class="post-title">{{ post.title }}</h2>
      <div class="post-meta">
        <span class="post-author">by <b>{{ post.author }}</b></span>
        <span class="separator">·</span>
        <span class="post-date">{{ formatDate(post.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-card {
  padding: 1.5rem 0;
  border-bottom: 1px solid #e9ecef;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-2px);
}

.post-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #212529;
  margin: 0 0 0.5rem 0;
  word-break: break-all;
}

.post-meta {
  font-size: 0.875rem;
  color: #868e96;
  display: flex;
  align-items: center;
  gap: 8px;
}

.post-author b {
  color: #495057;
}

.separator {
  color: #dee2e6;
}
</style>