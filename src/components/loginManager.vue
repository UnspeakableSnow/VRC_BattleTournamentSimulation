<!-- 複数ルーム実装してWebSocketで共有することになったら使う。今はゴミ。 -->
<script setup lang="ts">
import { defineEmits, ref } from 'vue'
const emits = defineEmits<{
  (e: 'login'): void
}>()

const password = ref('')
const login = () => {
  if (password.value === 'CHnTQGRbIzeh792czC') {
    console.log('ログイン成功')
    emits('login')
  } else {
    console.log('ログイン失敗')
  }
}
</script>

<template>
  <div>
    <h1>ログイン</h1>
    <form @submit.prevent="login()">
      <input type="password" v-model="password" placeholder="パスワード" />
      <input type="submit" value="ログイン" />
    </form>
  </div>
</template>

<style scoped>
h1 {
  font-size: 1.5em;
}
input {
  width: 100%;
  padding: 0.5em;
  margin: 0.5em 0;
}
</style>
