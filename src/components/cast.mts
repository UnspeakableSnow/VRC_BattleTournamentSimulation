export type target = 'front' | 'all' | 'select1' | 'select2' | 'select3'
export type damageType = 'Normal' | 'Heal' | 'Skill' | 'Finisher'
export type damageEffect = { target: target; damage: number; damageType: damageType }
export type gameStatus = 'select' | 'janken' | 'activeSkillCheck' | 'dice' | 'damage' | 'turnEnd'
export type gameStatusEffects = { [key: string]: gameStatus }
export type skillReturn = {
  gameStatusEffects: gameStatusEffects
  diceEffects: diceEffects
  damage: damageEffect[]
}
export type diceEffects = { [key: string]: number }
export type selectingCast = { status: boolean; team: 'red' | 'blue'; index: number }
// ------------------------------------------------------------ キャラ追加で必要な変更箇所
export type castClass = cast | cast_P | cast_B | cast_blackStrayCat | cast_chiroChoco | cast_gaumaru
type skillCheckArgs = {
  gameStatus: gameStatus
  isRock: boolean
  isWin: boolean
  dice: number
  turn: number
  party: [castClass, castClass, castClass]
}
// 必殺技（finisher）は自分がチームの二番目にいる（パートナー）時のみ発動可能
// finisherは軽減、無効化できない

// ------------------------------------------------------------ キャラ追加で必要な変更箇所
export default function returnCast(
  id: string,
  team: 'red' | 'blue',
): cast | cast_P | cast_B | cast_blackStrayCat | cast_chiroChoco | cast_gaumaru {
  switch (id) {
    case 'P':
      return new cast_P(team)
    case 'B':
      return new cast_B(team)
    case 'blackStrayCat':
      return new cast_blackStrayCat(team)
    case 'chiroChoco':
      return new cast_chiroChoco(team)
    case 'gaumaru':
      return new cast_gaumaru(team)
    default:
      return new cast(team)
  }
}

export class cast {
  id = 'undefined'
  maxHp = 20
  hp: number
  team: 'red' | 'blue'
  skillAble = false
  finisherAble = false
  activeSkillUsed = false
  buffs: { [key: string]: number } = {}
  constructor(team: 'red' | 'blue') {
    this.hp = this.maxHp
    this.team = team
  }
  returnImgUri(): string {
    return `./castImages/${this.id}.webp`
  }
  normalyAttack(dice: number): damageEffect {
    return { target: 'front', damage: dice, damageType: 'Normal' }
  }
  damaged(damage: number, fromParty: boolean, damageType: damageType, dice: number): void {
    this.hp -= damage
  }
  skillCheck(skillCheckArgs: skillCheckArgs): {
    gameStatusEffects: gameStatusEffects
    diceEffects: diceEffects
    damage: damageEffect[]
  } {
    const { gameStatus, isRock, isWin, dice, turn, party } = skillCheckArgs
    return { gameStatusEffects: {}, diceEffects: {}, damage: [] }
  }
  activeSkill(selectingCast: selectingCast): {
    gameStatusEffects: gameStatusEffects
    diceEffects: diceEffects
    damage: damageEffect[]
  } {
    return { gameStatusEffects: {}, diceEffects: {}, damage: [] }
  }
  finisher(selectingCast: selectingCast): {
    gameStatusEffects: gameStatusEffects
    diceEffects: diceEffects
    damage: damageEffect[]
  } {
    return { gameStatusEffects: {}, diceEffects: {}, damage: [] }
  }
  turnEnd(): void {
    // Buffsを減らす処理
    for (const key in this.buffs) {
      this.buffs[key] -= 1
      if (this.buffs[key] == 0) {
        delete this.buffs[key]
      }
    }
  }
}

export class cast_P extends cast {
  id = 'P'
  maxHp = 20
  constructor(team: 'red' | 'blue') {
    super(team)
    this.hp = this.maxHp
  }
}
export class cast_B extends cast {
  id = 'B'
  maxHp = 20
  constructor(team: 'red' | 'blue') {
    super(team)
    this.hp = this.maxHp
  }
}

// ------------------------------------------------------------ キャラ追加で必要な変更箇所
export class cast_blackStrayCat extends cast {
  id = 'blackStrayCat'
  maxHp = 10
  text =
    'パッシブ：被ダメージ字、相手のダイス判定が三以下なら回避。必殺：体力半分以下、グーで勝ったときに発動可能で敵一体に三十ダメージ'
  constructor(team: 'red' | 'blue') {
    super(team)
    this.hp = this.maxHp
  }
  damaged(damage: number, fromParty: boolean, damageType: damageType, dice: number): void {
    if (damageType === 'Normal' && dice <= 3) {
      return
    } else {
      this.hp -= damage
    }
  }
  skillCheck(skillCheckArgs: skillCheckArgs): {
    gameStatusEffects: gameStatusEffects
    diceEffects: diceEffects
    damage: damageEffect[]
  } {
    const { party, gameStatus, dice, isRock, isWin } = skillCheckArgs
    // finisher
    if (
      party.findIndex((c) => c.id === 'blackStrayCat') === 1 &&
      gameStatus === 'activeSkillCheck' &&
      this.hp <= this.maxHp / 2 &&
      isWin &&
      isRock
    ) {
      this.finisherAble = true
    } else {
      this.finisherAble = false
    }
    return { gameStatusEffects: {}, diceEffects: {}, damage: [] }
  }
  finisher(selectingCast: selectingCast): {
    gameStatusEffects: gameStatusEffects
    diceEffects: diceEffects
    damage: damageEffect[]
  } {
    console.log(selectingCast)
    if (selectingCast.status && selectingCast.team !== this.team) {
      switch (selectingCast.index) {
        case 0:
          return {
            gameStatusEffects: {},
            diceEffects: {},
            damage: [{ target: 'select1', damage: 30, damageType: 'Finisher' }],
          }
        case 1:
          return {
            gameStatusEffects: {},
            diceEffects: {},
            damage: [{ target: 'select2', damage: 30, damageType: 'Finisher' }],
          }
        case 2:
          return {
            gameStatusEffects: {},
            diceEffects: {},
            damage: [{ target: 'select3', damage: 30, damageType: 'Finisher' }],
          }
      }
    }
    return { gameStatusEffects: {}, diceEffects: {}, damage: [] }
  }
}

export class cast_chiroChoco extends cast {
  id = 'chiroChoco'
  maxHp = 14
  text = 'パッシブ：相手のダイス判定を-1する。必殺：相手全体に12-自分の体力ダメージ'
  constructor(team: 'red' | 'blue') {
    super(team)
    this.hp = this.maxHp
  }
  skillCheck(skillCheckArgs: skillCheckArgs): {
    gameStatusEffects: gameStatusEffects
    diceEffects: diceEffects
    damage: damageEffect[]
  } {
    const { party, gameStatus, isRock, isWin } = skillCheckArgs
    const diceEffects: diceEffects = {}
    // passive
    if (gameStatus === 'dice' && !isWin) {
      diceEffects['chiroChocoPassive'] = -1
    }
    // finisher
    if (
      party.findIndex((c) => c.id === 'blackStrayCat') === 1 &&
      gameStatus === 'activeSkillCheck' &&
      isWin
    ) {
      this.finisherAble = true
    } else {
      this.finisherAble = false
    }
    return { gameStatusEffects: {}, diceEffects: diceEffects, damage: [] }
  }
  finisher(selectingCast: selectingCast): {
    gameStatusEffects: gameStatusEffects
    diceEffects: diceEffects
    damage: damageEffect[]
  } {
    return {
      gameStatusEffects: {},
      diceEffects: {},
      damage: [{ target: 'all', damage: 12 - this.hp, damageType: 'Finisher' }],
    }
  }
}

export class cast_gaumaru extends cast {
  id = 'gaumaru'
  maxHp = 20
  text =
    'アクティブ：２ターン目以降に発動可能で、その後二ターンの間、自分のダイス判定を+1、受けるダメージを-1する。必殺：HP半分以下、じゃんけんでグーで勝ったとき敵一体に30ダメージ'
  constructor(team: 'red' | 'blue') {
    super(team)
    this.hp = this.maxHp
  }
  damaged(damage: number, fromParty: boolean, damageType: damageType, dice: number): void {
    if ('hero' in this.buffs && this.buffs['hero'] > 0) {
      this.hp -= damage - 1
    } else if ('heroActived' in this.buffs) {
      this.hp -= damage + 1
    } else {
      this.hp -= damage
    }
  }
  skillCheck(skillCheckArgs: skillCheckArgs): {
    gameStatusEffects: gameStatusEffects
    diceEffects: diceEffects
    damage: damageEffect[]
  } {
    const { party, gameStatus, isRock, isWin, turn } = skillCheckArgs
    const diceEffects: diceEffects = {}
    // heroMode
    if ('hero' in this.buffs && this.buffs['hero'] > 0 && gameStatus === 'dice') {
      if (isWin) {
        diceEffects['gaumaruHero'] = 1
      }
    }
    // active
    if (!this.activeSkillUsed && gameStatus === 'activeSkillCheck' && turn >= 1) {
      this.skillAble = true
    } else {
      this.skillAble = false
    }
    // finisher
    if (
      party.findIndex((c) => c.id === 'gaumaru') === 1 &&
      gameStatus === 'activeSkillCheck' &&
      this.hp <= this.maxHp / 2 &&
      isWin &&
      isRock
    ) {
      this.finisherAble = true
    } else {
      this.finisherAble = false
    }
    return { gameStatusEffects: {}, diceEffects: diceEffects, damage: [] }
  }
  activeSkill(selectingCast: selectingCast): {
    gameStatusEffects: gameStatusEffects
    diceEffects: diceEffects
    damage: damageEffect[]
  } {
    const diceEffects: diceEffects = {}
    this.buffs['hero'] = 2
    this.buffs['heroActived'] = -1
    this.activeSkillUsed = true
    return { gameStatusEffects: {}, diceEffects: diceEffects, damage: [] }
  }
  finisher(selectingCast: selectingCast): {
    gameStatusEffects: gameStatusEffects
    diceEffects: diceEffects
    damage: damageEffect[]
  } {
    if (selectingCast.status && selectingCast.team !== this.team) {
      switch (selectingCast.index) {
        case 0:
          return {
            gameStatusEffects: {},
            diceEffects: {},
            damage: [{ target: 'select1', damage: 30, damageType: 'Finisher' }],
          }
        case 1:
          return {
            gameStatusEffects: {},
            diceEffects: {},
            damage: [{ target: 'select2', damage: 30, damageType: 'Finisher' }],
          }
        case 2:
          return {
            gameStatusEffects: {},
            diceEffects: {},
            damage: [{ target: 'select3', damage: 30, damageType: 'Finisher' }],
          }
      }
    }
    return { gameStatusEffects: {}, diceEffects: {}, damage: [] }
  }
}
