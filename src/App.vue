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
  <h3>勝手に自己解釈したことリスト</h3>
  <ul>
  </ul>
  <h3>一言コメント</h3>
  <ul>
    <li>後で手動HP操作入れます。入れるからちょっと待って。。。</li>
  </ul>
  <footer>
    <p>v0.0.4</p>
  </footer>
</template>
