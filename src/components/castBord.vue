<script setup lang="ts">
import { ref } from 'vue'
import selectCast from './selectCast.vue'
import type { castClass, gameStatus, damageEffect, selectingCast, skillReturn } from './cast.mts'
import { cast, cast_B, cast_blackStrayCat, cast_chiroChoco, cast_gaumaru, cast_P } from './cast.mts'
import returnCast from './cast.mts'
import cardDisplay from './cardDisplay.vue'
const gameStatus = ref<gameStatus>('select')
// const gameStatusEffects = ref<{ [name: string]: string }>({})
const turn = ref(0)
const winner = ref<'red' | 'draw' | 'blue'>('draw')
const dice = ref<number>(1)
// const diceEffects = ref<{ [name: string]: number }>({})

const redTeamCasts = ref<[castClass, castClass, castClass]>([
  new cast('red'),
  new cast('red'),
  new cast('red'),
])
const blueTeamCasts = ref<[castClass, castClass, castClass]>([
  new cast('blue'),
  new cast('blue'),
  new cast('blue'),
])
// debug
redTeamCasts.value = [new cast_B('red'), new cast_gaumaru('red'), new cast_blackStrayCat('red')]
blueTeamCasts.value = [
  new cast_P('blue'),
  new cast_blackStrayCat('blue'),
  new cast_chiroChoco('blue'),
]

// ------------------------------------------------------------ キャラ追加で必要な変更箇所
const availableCasts = ['B', 'P', 'blackStrayCat', 'chiroChoco', 'gaumaru']
const selectingCast = ref<selectingCast>({
  status: false,
  team: 'red',
  index: 0,
})
const changeCast = (castId: string) => {
  if (selectingCast.value.team === 'red') {
    redTeamCasts.value[selectingCast.value.index] = returnCast(castId, 'red')
  } else {
    blueTeamCasts.value[selectingCast.value.index] = returnCast(castId, 'blue')
  }
  selectingCast.value.status = false
}

const jankenRed = ref<'rock' | 'scissors' | 'paper'>('rock')
const jankenBlue = ref<'rock' | 'scissors' | 'paper'>('rock')

const teamSelected = () => {
  gameStatus.value = 'janken'
}

const janken = () => {
  if (jankenRed.value === jankenBlue.value) {
    winner.value = 'draw'
  } else if (jankenRed.value === 'rock' && jankenBlue.value === 'scissors') {
    winner.value = 'red'
  } else if (jankenRed.value === 'scissors' && jankenBlue.value === 'paper') {
    winner.value = 'red'
  } else if (jankenRed.value === 'paper' && jankenBlue.value === 'rock') {
    winner.value = 'red'
  } else {
    winner.value = 'blue'
  }
  skillCheck()

  if (winner.value !== 'draw') {
    gameStatus.value = 'activeSkillCheck'
    skillCheck()
  }
}

const damageCalc = (fromTeam: 'red' | 'blue', fromIndex: number, damageEffects: damageEffect[]) => {
  for (const damageEffect of damageEffects) {
    if (fromTeam === 'red') {
      if (damageEffect.target === 'front') {
        blueTeamCasts.value[fromIndex].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
      } else if (damageEffect.target === 'all') {
        blueTeamCasts.value[0].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
        blueTeamCasts.value[1].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
        blueTeamCasts.value[2].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
      } else if (damageEffect.target === 'select1') {
        blueTeamCasts.value[0].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
      } else if (damageEffect.target === 'select2') {
        blueTeamCasts.value[1].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
      } else if (damageEffect.target === 'select3') {
        blueTeamCasts.value[2].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
      }
    } else {
      if (damageEffect.target === 'front') {
        redTeamCasts.value[fromIndex].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
      } else if (damageEffect.target === 'all') {
        redTeamCasts.value[0].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
        redTeamCasts.value[1].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
        redTeamCasts.value[2].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
      } else if (damageEffect.target === 'select1') {
        redTeamCasts.value[0].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
      } else if (damageEffect.target === 'select2') {
        redTeamCasts.value[1].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
      } else if (damageEffect.target === 'select3') {
        redTeamCasts.value[2].damaged(
          damageEffect.damage,
          false,
          damageEffect.damageType,
          dice.value,
        )
      }
    }
  }
}

const normalyAttack = () => {
  dice.value = parseInt(dice.value.toString()) //謎のバグが起きるため
  skillCheck() //ダイスフェーズのスキルチェック

  gameStatus.value = 'damage'
  if (winner.value === 'red') {
    for (let i = 0; i < 3; i++) {
      const attackData = [redTeamCasts.value[i].normalyAttack(dice.value)]
      damageCalc('red', i, attackData)
    }
  } else if (winner.value === 'blue') {
    for (let i = 0; i < 3; i++) {
      const attackData = [blueTeamCasts.value[i].normalyAttack(dice.value)]
      damageCalc('blue', i, attackData)
    }
  }
  turn.value++
  skillCheck()

  gameStatus.value = 'turnEnd'
  redTeamCasts.value.forEach((c) => {
    c.turnEnd()
  })
  blueTeamCasts.value.forEach((c) => {
    c.turnEnd()
  })
  winner.value = 'draw'
  gameStatus.value = 'janken'
}

const skillCheck = () => {
  for (let i = 0; i < 3; i++) {
    const ref = redTeamCasts.value[i].skillCheck({
      gameStatus: gameStatus.value,
      isRock: jankenRed.value === 'rock',
      isWin: winner.value === 'red',
      dice: dice.value,
      turn: turn.value,
      party: redTeamCasts.value,
    })
    for (const effect in ref.gameStatusEffects) {
      gameStatus.value = ref.gameStatusEffects[effect]
    }
    for (const effect in ref.diceEffects) {
      dice.value += ref.diceEffects[effect]
    }
    if (ref.damage.length !== 0) {
      damageCalc('red', i, ref.damage)
    }
  }
  for (let i = 0; i < 3; i++) {
    const ref = blueTeamCasts.value[i].skillCheck({
      gameStatus: gameStatus.value,
      isRock: jankenBlue.value === 'rock',
      isWin: winner.value === 'blue',
      dice: dice.value,
      turn: turn.value,
      party: blueTeamCasts.value,
    })
    for (const effect in ref.gameStatusEffects) {
      gameStatus.value = ref.gameStatusEffects[effect]
    }
    for (const effect in ref.diceEffects) {
      dice.value += ref.diceEffects[effect]
    }
    if (ref.damage.length !== 0) {
      damageCalc('blue', i, ref.damage)
    }
  }
}

const activeSkillHandle = (ref: skillReturn, team: 'red' | 'blue', index: number) => {
  for (const effect in ref.gameStatusEffects) {
    gameStatus.value = ref.gameStatusEffects[effect]
  }
  for (const effect in ref.diceEffects) {
    dice.value += ref.diceEffects[effect]
  }
  damageCalc(team, index, ref.damage)
}
</script>

<template>
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
  <button
    v-if="
      gameStatus === 'select' &&
      !redTeamCasts.find((c) => c.id === 'undefined') &&
      !blueTeamCasts.find((c) => c.id === 'undefined')
    "
    @click="teamSelected()"
  >
    start buttle
  </button>
  <form @submit.prevent="janken()" v-if="gameStatus === 'janken'">
    赤チーム
    <select v-model="jankenRed" size="3">
      <option value="rock">rock</option>
      <option value="scissors">scissors</option>
      <option value="paper">paper</option>
    </select>
    青チーム
    <select v-model="jankenBlue" size="3">
      <option value="rock">rock</option>
      <option value="scissors">scissors</option>
      <option value="paper">paper</option>
    </select>
    <input type="submit" value="じゃんけん確定" />
  </form>
  <form @submit.prevent="normalyAttack()" v-if="gameStatus === 'dice'">
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
  <button v-if="gameStatus === 'activeSkillCheck'" @click="gameStatus = 'dice'">
    スキル・必殺技処理完了
  </button>
  <p class="debug">
    {{ gameStatus }}
    {{ winner }}
    {{ dice }}
  </p>

  <div>
    <h2>キャストボード</h2>
    <div>
      <h3>赤チーム</h3>
      <div class="castRow">
        <cardDisplay
          v-for="(cast, i) in redTeamCasts"
          :key="cast.id"
          class="cast"
          :class="{
            selected:
              selectingCast.status && selectingCast.team === 'red' && selectingCast.index === i,
          }"
          :cast="cast"
          :team="'red'"
          :i="i"
          :gameStatus="gameStatus"
          :selectingCast="selectingCast"
          @returnSkill="
            (ref: skillReturn) => {
              activeSkillHandle(ref, 'red', i)
            }
          "
          @returnSelectingCast="
            (ref: selectingCast) => {
              selectingCast.status = ref.status
              selectingCast.team = ref.team
              selectingCast.index = ref.index
            }
          "
        />
      </div>
      <h3>青チーム</h3>
      <div class="castRow">
        <cardDisplay
          v-for="(cast, i) in blueTeamCasts"
          :key="cast.id"
          class="cast"
          :class="{
            selected:
              selectingCast.status && selectingCast.team === 'blue' && selectingCast.index === i,
          }"
          :cast="cast"
          :team="'blue'"
          :i="i"
          :gameStatus="gameStatus"
          :selectingCast="selectingCast"
          @returnSkill="
            (ref: skillReturn) => {
              activeSkillHandle(ref, 'blue', i)
            }
          "
          @returnSelectingCast="
            (ref: selectingCast) => {
              selectingCast.status = ref.status
              selectingCast.team = ref.team
              selectingCast.index = ref.index
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.selected {
  border: 5px solid yellow;
}
.castRow {
  display: flex;
  justify-content: center;
}
.debug {
  margin: 0;
  font-size: smaller;
}
</style>
