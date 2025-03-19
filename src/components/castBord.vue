<script setup lang="ts">
import { ref } from 'vue'
import selectCast from './selectCast.vue'
import type { target, damageType, castClass, gameStatus } from './cast.mts'
import { cast, Cast_B, Cast_P } from './cast.mts'
import returnCast from './cast.mts'
const gameStatus = ref<gameStatus>('select')
// 全キャラのスキル・必殺技判定終了確認
const GameStatusTerminated = ref(false)
const redIsRock = ref(false)
const blueIsRock = ref(false)
const winner = ref<'red' | 'draw' | 'blue'>('draw')
const dice = ref<1 | 2 | 3 | 4 | 5 | 6>(1)

const redTeamCasts = ref<[castClass, castClass, castClass]>([new cast(), new cast(), new cast()])
const blueTeamCasts = ref<[castClass, castClass, castClass]>([new cast(), new cast(), new cast()])

const availableCasts = ['B', 'P']
const selectingCast = ref<{ status: boolean; team: 'red' | 'blue'; index: number }>({
  status: false,
  team: 'red',
  index: 0,
})
const changeCast = (castId: string) => {
  if (selectingCast.value.team === 'red') {
    redTeamCasts.value[selectingCast.value.index] = returnCast(castId)
  } else {
    blueTeamCasts.value[selectingCast.value.index] = returnCast(castId)
  }
  selectingCast.value.status = false
}

const jankenRed = ref(0)
const jankenBlue = ref(0)

const janken = (red: number, blue: number) => {
  if (red === 0) {
    redIsRock.value = true
  } else {
    redIsRock.value = false
  }
  if (blue === 0) {
    blueIsRock.value = true
  } else {
    blueIsRock.value = false
  }
  gameStatus.value = 'diceBefore'
  if (red === blue) {
    gameStatus.value = 'jankenDraw'
    winner.value = 'draw'
  } else if (red === 0 && blue === 1) {
    winner.value = 'red'
  } else if (red === 1 && blue === 2) {
    winner.value = 'red'
  } else if (red === 2 && blue === 0) {
    winner.value = 'red'
  } else {
    winner.value = 'blue'
  }
}

const crossDamage = () => {
  gameStatus.value = 'damageBefore'
  if (winner.value === 'red') {
    for (let i = 0; i < 3; i++) {
      const normalyAttackData = redTeamCasts.value[i].normalyAttack(dice.value)
      if (normalyAttackData[0] === 'front') {
        blueTeamCasts.value[i].damaged(normalyAttackData[1], false, 'Normal')
      } else if (normalyAttackData[0] === 'all') {
        blueTeamCasts.value[0].damaged(normalyAttackData[1], false, 'Normal')
        blueTeamCasts.value[1].damaged(normalyAttackData[1], false, 'Normal')
        blueTeamCasts.value[2].damaged(normalyAttackData[1], false, 'Normal')
      } else if (normalyAttackData[0] === 'select1') {
        blueTeamCasts.value[0].damaged(normalyAttackData[1], false, 'Normal')
      } else if (normalyAttackData[0] === 'select2') {
        blueTeamCasts.value[1].damaged(normalyAttackData[1], false, 'Normal')
      } else if (normalyAttackData[0] === 'select3') {
        blueTeamCasts.value[2].damaged(normalyAttackData[1], false, 'Normal')
      }
    }
  } else if (winner.value === 'blue') {
    for (let i = 0; i < 3; i++) {
      const normalyAttackData = blueTeamCasts.value[i].normalyAttack(dice.value)
      if (normalyAttackData[0] === 'front') {
        redTeamCasts.value[i].damaged(normalyAttackData[1], false, 'Normal')
      } else if (normalyAttackData[0] === 'all') {
        redTeamCasts.value[0].damaged(normalyAttackData[1], false, 'Normal')
        redTeamCasts.value[1].damaged(normalyAttackData[1], false, 'Normal')
        redTeamCasts.value[2].damaged(normalyAttackData[1], false, 'Normal')
      } else if (normalyAttackData[0] === 'select1') {
        redTeamCasts.value[0].damaged(normalyAttackData[1], false, 'Normal')
      } else if (normalyAttackData[0] === 'select2') {
        redTeamCasts.value[1].damaged(normalyAttackData[1], false, 'Normal')
      } else if (normalyAttackData[0] === 'select3') {
        redTeamCasts.value[2].damaged(normalyAttackData[1], false, 'Normal')
      }
    }
  }
  gameStatus.value = 'jankenBefore'
  redIsRock.value = false
  blueIsRock.value = false
  winner.value = 'draw'
}
</script>

<template>
  {{ gameStatus }}
  <div>
    <h2>キャストボード</h2>
    <div>
      <h3>赤チーム</h3>
      <div class="castRow">
        <div
          v-for="(cast, i) in redTeamCasts"
          :key="cast.id"
          class="cast"
          @click="selectingCast = { status: true, team: 'red', index: i }"
        >
          <img :src="cast.returnImgUri()" />
          <p>HP: {{ cast.hp }} / {{ cast.maxHp }}</p>
        </div>
      </div>
      <h3>青チーム</h3>
      <div class="castRow">
        <div
          v-for="(cast, i) in blueTeamCasts"
          :key="cast.id"
          class="cast"
          @click="selectingCast = { status: true, team: 'blue', index: i }"
        >
          <img :src="cast.returnImgUri()" />
          <p>HP: {{ cast.hp }} / {{ cast.maxHp }}</p>
        </div>
      </div>
      <selectCast
        :availableCasts="availableCasts"
        v-if="selectingCast.status === true && gameStatus === 'select'"
        @selectedCast="
          (castId: string) => {
            changeCast(castId)
          }
        "
        @close="selectingCast.status = false"
      />
    </div>
  </div>
  <button
    v-if="
      gameStatus === 'select' &&
      !redTeamCasts.find((c) => c.id === 'undefined') &&
      !blueTeamCasts.find((c) => c.id === 'undefined')
    "
    @click="gameStatus = 'jankenBefore'"
  >
    start buttle
  </button>
  <form @submit.prevent="janken(jankenRed, jankenBlue)" v-if="gameStatus === 'jankenBefore'">
    <select v-model="jankenRed" size="3">
      <option value="0">rock</option>
      <option value="1">scissors</option>
      <option value="2">paper</option>
    </select>
    <select v-model="jankenBlue" size="3">
      <option value="0">rock</option>
      <option value="1">scissors</option>
      <option value="2">paper</option>
    </select>
    <input type="submit" value="じゃんけん確定" />
  </form>
  <form @submit.prevent="crossDamage()" v-if="gameStatus === 'diceBefore'">
    <select v-model="dice" size="6">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
    </select>
    <input type="submit" value="ダイス確定" />
  </form>
  <br />
  {{ winner }}
  {{ dice }}
</template>

<style scoped>
.cast {
  width: 20%;
  margin: 0 10px;
  padding: 2px;
  border: 1px solid black;
  border-radius: 10px;
  text-align: center;
  display: inline-block;
}
.cast img {
  width: 100%;
  border-radius: 10px;
}
.cast p {
  margin: 0;
}
.castRow {
  display: flex;
  justify-content: center;
}
</style>
