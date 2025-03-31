<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- 複数ルーム実装してWebSocketで共有することになったら使う。今はゴミ。 -->
<script setup lang="ts">
import { defineEmits } from 'vue'
// eslint-disable-next-line vue/no-dupe-keys
import type { cast, selectingCast, skillReturn } from './cast.mts'
const prop = defineProps<{
  cast: cast
  team: 'red' | 'blue'
  i: number
  gameStatus: string
  selectingCast: selectingCast
}>()
const emits = defineEmits<{
  (e: 'returnSelectingCast', value: selectingCast): void
  (e: 'returnSkill', value: skillReturn): void
}>()
</script>

<template>
  <div>
    <img
      :src="cast.returnImgUri()"
      :alt="cast.returnImgUri()"
      @click="emits('returnSelectingCast', { status: true, team: team, index: i })"
    />
    <p>
      HP: <span style="color: red" v-if="cast.hp <= 0">{{ cast.hp }}</span
      ><span v-else>{{ cast.hp }}</span> / {{ cast.maxHp }}
    </p>
    <p style="font-size: smaller">Buff: {{ cast.buffs }}</p>
    <button
      v-if="gameStatus === 'activeSkillCheck' && cast.skillAble"
      @click="emits('returnSkill', cast.activeSkill(selectingCast))"
    >
      アクティブスキル
    </button>
    <button
      v-if="gameStatus === 'activeSkillCheck' && cast.finisherAble && i === 0"
      @click="emits('returnSkill', cast.finisher(selectingCast))"
    >
      必殺技
    </button>
  </div>
</template>

<style scoped>
div {
  display: inline-block;
  width: 100px;
  margin: 0.5em;
  padding: 0.5em;
  border: 1px solid black;
  border-radius: 10px;
  text-align: center;
}
img {
  width: 100%;
  border-radius: 10px;
}
p {
  margin: 0;
}
</style>
