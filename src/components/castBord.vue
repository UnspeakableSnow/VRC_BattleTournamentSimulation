<script setup lang="ts">
import { ref } from 'vue'
import selectCast from './selectCast.vue'
import type { castClass, gameStatus, target, damageType } from './cast.mts'
import { cast, cast_B, cast_blackStrayCat, cast_chiroChoco, cast_gaumaru, cast_P } from './cast.mts'
import returnCast from './cast.mts'
const gameStatus = ref<gameStatus>('select')
const turn = ref(0)
const winner = ref<'red' | 'draw' | 'blue'>('draw')
const dice = ref(1)

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
const selectingCast = ref<{ status: boolean; team: 'red' | 'blue'; index: number }>({
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
  gameStatus.value = 'jankenBefore'
  passiveSkillCheck()
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
  if (winner.value === 'draw') {
    gameStatus.value = 'jankenBefore'
  } else {
    gameStatus.value = 'diceBefore'
  }
  passiveSkillCheck()
}

const crossDamage = () => {
  gameStatus.value = 'damageBefore'
  passiveSkillCheck()
  if (winner.value === 'red') {
    for (let i = 0; i < 3; i++) {
      const normalyAttackData = redTeamCasts.value[i].normalyAttack(dice.value)
      if (normalyAttackData[0] === 'front') {
        blueTeamCasts.value[i].damaged(normalyAttackData[1], false, 'Normal', dice.value)
      } else if (normalyAttackData[0] === 'all') {
        blueTeamCasts.value[0].damaged(normalyAttackData[1], false, 'Normal', dice.value)
        blueTeamCasts.value[1].damaged(normalyAttackData[1], false, 'Normal', dice.value)
        blueTeamCasts.value[2].damaged(normalyAttackData[1], false, 'Normal', dice.value)
      } else if (normalyAttackData[0] === 'select1') {
        blueTeamCasts.value[0].damaged(normalyAttackData[1], false, 'Normal', dice.value)
      } else if (normalyAttackData[0] === 'select2') {
        blueTeamCasts.value[1].damaged(normalyAttackData[1], false, 'Normal', dice.value)
      } else if (normalyAttackData[0] === 'select3') {
        blueTeamCasts.value[2].damaged(normalyAttackData[1], false, 'Normal', dice.value)
      }
    }
  } else if (winner.value === 'blue') {
    for (let i = 0; i < 3; i++) {
      const normalyAttackData = blueTeamCasts.value[i].normalyAttack(dice.value)
      if (normalyAttackData[0] === 'front') {
        redTeamCasts.value[i].damaged(normalyAttackData[1], false, 'Normal', dice.value)
      } else if (normalyAttackData[0] === 'all') {
        redTeamCasts.value[0].damaged(normalyAttackData[1], false, 'Normal', dice.value)
        redTeamCasts.value[1].damaged(normalyAttackData[1], false, 'Normal', dice.value)
        redTeamCasts.value[2].damaged(normalyAttackData[1], false, 'Normal', dice.value)
      } else if (normalyAttackData[0] === 'select1') {
        redTeamCasts.value[0].damaged(normalyAttackData[1], false, 'Normal', dice.value)
      } else if (normalyAttackData[0] === 'select2') {
        redTeamCasts.value[1].damaged(normalyAttackData[1], false, 'Normal', dice.value)
      } else if (normalyAttackData[0] === 'select3') {
        redTeamCasts.value[2].damaged(normalyAttackData[1], false, 'Normal', dice.value)
      }
    }
  }
  turn.value++
  gameStatus.value = 'turnEnd'
  winner.value = 'draw'
  passiveSkillCheck()
  gameStatus.value = 'jankenBefore'
}

const activeSkillCheck = () => {
  gameStatus.value = 'activeSkillCheck'
  passiveSkillCheck()
  redTeamCasts.value.forEach((c) => {
    c.skillCheck({
      gameStatus: gameStatus.value,
      isRock: jankenRed.value === 'rock',
      isWin: winner.value === 'red',
      dice: dice.value,
      turn: turn.value,
      party: redTeamCasts.value,
    })
  })
  blueTeamCasts.value.forEach((c) => {
    c.skillCheck({
      gameStatus: gameStatus.value,
      isRock: jankenBlue.value === 'rock',
      isWin: winner.value === 'blue',
      dice: dice.value,
      turn: turn.value,
      party: blueTeamCasts.value,
    })
  })
  if (
    redTeamCasts.value.every((c) => !c.skillAble && !c.finisherAble) &&
    blueTeamCasts.value.every((c) => !c.skillAble && !c.finisherAble)
  ) {
    crossDamage()
  }
}

const passiveSkillCheck = () => {
  for (let i = 0; i < 3; i++) {
    const ref = redTeamCasts.value[i].skillCheck({
      gameStatus: gameStatus.value,
      isRock: jankenRed.value === 'rock',
      isWin: winner.value === 'red',
      dice: dice.value,
      turn: turn.value,
      party: redTeamCasts.value,
    })
    gameStatus.value = ref.gameStatus
    dice.value = ref.dice
    if (ref.damage[1] !== 0) {
      skillDamage(ref.damage, 'red', i, 'Skill')
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
    gameStatus.value = ref.gameStatus
    dice.value = ref.dice
    if (ref.damage[1] !== 0) {
      skillDamage(ref.damage, 'blue', i, 'Skill')
    }
  }
}

const skillDamage = (
  arg: [target, number],
  team: 'red' | 'blue',
  index: number,
  damageType: damageType,
) => {
  const target = arg[0]
  const damage = arg[1]
  console.log(arg)
  if (team === 'red') {
    if (target === 'front') {
      blueTeamCasts.value[index].damaged(damage, false, damageType, dice.value)
    } else if (target === 'all') {
      blueTeamCasts.value[0].damaged(damage, false, damageType, dice.value)
      blueTeamCasts.value[1].damaged(damage, false, damageType, dice.value)
      blueTeamCasts.value[2].damaged(damage, false, damageType, dice.value)
    } else if (target === 'select1') {
      blueTeamCasts.value[0].damaged(damage, false, damageType, dice.value)
    } else if (target === 'select2') {
      blueTeamCasts.value[1].damaged(damage, false, damageType, dice.value)
    } else if (target === 'select3') {
      blueTeamCasts.value[2].damaged(damage, false, damageType, dice.value)
    }
  } else {
    if (target === 'front') {
      redTeamCasts.value[index].damaged(damage, false, damageType, dice.value)
    } else if (target === 'all') {
      redTeamCasts.value[0].damaged(damage, false, damageType, dice.value)
      redTeamCasts.value[1].damaged(damage, false, damageType, dice.value)
      redTeamCasts.value[2].damaged(damage, false, damageType, dice.value)
    } else if (target === 'select1') {
      redTeamCasts.value[0].damaged(damage, false, damageType, dice.value)
    } else if (target === 'select2') {
      redTeamCasts.value[1].damaged(damage, false, damageType, dice.value)
    } else if (target === 'select3') {
      redTeamCasts.value[2].damaged(damage, false, damageType, dice.value)
    }
  }
  passiveSkillCheck()
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
  <form @submit.prevent="janken()" v-if="gameStatus === 'jankenBefore'">
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
  <form @submit.prevent="activeSkillCheck()" v-if="gameStatus === 'diceBefore'">
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
  <button v-if="gameStatus === 'activeSkillCheck'" @click="crossDamage()">
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
        <div
          v-for="(cast, i) in redTeamCasts"
          :key="cast.id"
          class="cast"
          :class="{
            selected:
              selectingCast.status && selectingCast.team === 'red' && selectingCast.index === i,
          }"
        >
          <img
            :src="cast.returnImgUri()"
            :alt="cast.returnImgUri()"
            @click="selectingCast = { status: true, team: 'red', index: i }"
          />
          <p>
            HP: <span style="color: red" v-if="cast.hp <= 0">{{ cast.hp }}</span
            ><span v-else>{{ cast.hp }}</span> / {{ cast.maxHp }}
          </p>
          <p>{{ cast.buffs }}</p>
          {{ cast.skillAble }}
          <button
            v-if="gameStatus === 'activeSkillCheck' && cast.skillAble"
            @click="
              skillDamage(
                cast.activeSkill(selectingCast.status, selectingCast.team, selectingCast.index),
                'red',
                i,
                'Skill',
              )
            "
          >
            アクティブスキル
          </button>
          <button
            v-if="gameStatus === 'activeSkillCheck' && cast.finisherAble"
            @click="
              skillDamage(
                cast.finisher(selectingCast.status, selectingCast.team, selectingCast.index),
                'red',
                i,
                'Finisher',
              )
            "
          >
            必殺技
          </button>
        </div>
      </div>
      <h3>青チーム</h3>
      <div class="castRow">
        <div
          v-for="(cast, i) in blueTeamCasts"
          :key="cast.id"
          class="cast"
          :class="{
            selected:
              selectingCast.status && selectingCast.team === 'blue' && selectingCast.index === i,
          }"
        >
          <img
            :src="cast.returnImgUri()"
            :alt="cast.returnImgUri()"
            @click="selectingCast = { status: true, team: 'blue', index: i }"
          />
          <p>
            HP: <span style="color: red" v-if="cast.hp <= 0">{{ cast.hp }}</span
            ><span v-else>{{ cast.hp }}</span> / {{ cast.maxHp }}
          </p>
          <button
            v-if="gameStatus === 'activeSkillCheck' && cast.skillAble"
            @click="
              skillDamage(
                cast.activeSkill(selectingCast.status, selectingCast.team, selectingCast.index),
                'blue',
                i,
                'Skill',
              )
            "
          >
            アクティブスキル
          </button>
          <button
            v-if="gameStatus === 'activeSkillCheck' && cast.finisherAble"
            @click="
              skillDamage(
                cast.finisher(selectingCast.status, selectingCast.team, selectingCast.index),
                'blue',
                i,
                'Finisher',
              )
            "
          >
            必殺技
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cast {
  width: 20%;
  margin: 0 10px;
  padding: 2px;
  border: 5px solid black;
  border-radius: 10px;
  text-align: center;
  display: inline-block;
}
.selected {
  border: 5px solid yellow;
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
.debug {
  margin: 0;
  font-size: smaller;
}
</style>
