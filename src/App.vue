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
    <li>ガーマルさんの「５ターン目以降」消去（なんかそんな話してた気がするので）</li>
    <li>
      チロチョコさんの必殺技要件にじゃんけん勝利時を追加（毎ゲーム必ず必殺が撃てるようには作ってないだろうなと判断して）
    </li>
    <li>ガーマルさんのヒーローモードをバフ判定（管理しやすいから）</li>
  </ul>
  <h3>一言コメント</h3>
  <ul>
    <li>ボス無理です。（作るなら他の人にして。。。）</li>
    <li>
      通常攻撃のダメージを合計して受ける人数で割る処理はだるいので後に回させてください。。。.:_(8o｣∠)_:.
    </li>
    <li>後で手動HP操作入れます。入れるからちょっと待って。。。</li>
  </ul>
</template>
