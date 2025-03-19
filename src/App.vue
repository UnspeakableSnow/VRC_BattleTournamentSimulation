<!-- 全体管理 -->
<script setup lang="ts">
import { ref } from 'vue'
import castBord from './components/castBord.vue'

const SystemState = ref('OnGame')
</script>

<template>
  <h1>VRCバトルトーナメント</h1>
  <h2>スキル撃ち漏らしチェック＆バランス調整用シミュレータ</h2>
  <castBord v-if="SystemState === 'OnGame'" />
</template>
