export type target = 'front' | 'all' | 'select1' | 'select2' | 'select3'
export type damageType = 'Normal' | 'Heal' | 'Skill' | 'Finisher'
export type gameStatus =
  | 'select'
  | 'jankenBefore'
  | 'diceBefore'
  | 'activeSkillCheck'
  | 'damageBefore'
  | 'turnEnd'
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
  skillAbleGameStatus = ['diceBefore']
  finisherAbleGameStatus = ['diceBefore']
  selected = false
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
  normalyAttack(dice: number): [target, number] {
    return ['front', dice]
  }
  damaged(damage: number, fromParty: boolean, damageType: damageType, dice: number): void {
    this.hp -= damage
  }
  skillCheck(skillCheckArgs: skillCheckArgs): {
    gameStatus: gameStatus
    dice: number
    damage: [target, number]
  } {
    const { gameStatus, isRock, isWin, dice, turn, party } = skillCheckArgs
    return { gameStatus: gameStatus, dice: dice, damage: ['front', 0] }
  }
  activeSkill(status: boolean, team: 'red' | 'blue', index: number): [target, number] {
    return ['front', 0]
  }
  finisher(status: boolean, team: 'red' | 'blue', index: number): [target, number] {
    return ['front', 0]
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
    gameStatus: gameStatus
    dice: number
    damage: [target, number]
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
    return { gameStatus: gameStatus, dice: dice, damage: ['front', 0] }
  }
  finisher(status: boolean, team: 'red' | 'blue', index: number): [target, number] {
    console.log(status, team, index)
    if (status && team !== this.team) {
      switch (index) {
        case 0:
          return ['select1', 30]
        case 1:
          return ['select2', 30]
        case 2:
          return ['select3', 30]
      }
    }
    return ['front', 0]
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
    gameStatus: gameStatus
    dice: number
    damage: [target, number]
  } {
    const { party, gameStatus, isRock, isWin } = skillCheckArgs
    let { dice } = skillCheckArgs
    // passive
    if (gameStatus === 'activeSkillCheck' && !isWin) {
      dice -= 1
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
    return { gameStatus: gameStatus, dice: dice, damage: ['front', 0] }
  }
  finisher(status: boolean, team: 'red' | 'blue', index: number): [target, number] {
    return ['all', 12 - this.hp]
  }
}

export class cast_gaumaru extends cast {
  id = 'gaumaru'
  maxHp = 20
  text =
    'アクティブ：２ターン目以降に発動可能で、その後二ターンの間、自分のダイス判定を+1、受けるダメージを-1する。必殺：HP半分以下、じゃんけんでグーで勝ったとき敵一体に30ダメージ'
  diceChangedTurns: number[] = []
  constructor(team: 'red' | 'blue') {
    super(team)
    this.hp = this.maxHp
  }
  damaged(damage: number, fromParty: boolean, damageType: damageType, dice: number): void {
    if (this.buffs['hero'] > 0) {
      this.hp -= damage - 1
    } else if (this.diceChangedTurns.length >= 2) {
      this.hp -= damage + 1
    } else {
      this.hp -= damage
    }
  }
  skillCheck(skillCheckArgs: skillCheckArgs): {
    gameStatus: gameStatus
    dice: number
    damage: [target, number]
  } {
    const { party, gameStatus, isRock, isWin, turn } = skillCheckArgs
    let { dice } = skillCheckArgs
    // heroMode
    if (this.buffs['hero'] > 0 && this.diceChangedTurns.findIndex((d) => d === turn) === -1) {
      this.diceChangedTurns.push(turn)
      if (isWin) {
        dice += 1
      }
    }
    if (this.buffs['hero'] > 0 && gameStatus === 'turnEnd') {
      this.buffs['hero'] -= 1
    }
    // active
    if (!this.activeSkillUsed && gameStatus === 'activeSkillCheck' && turn > 0) {
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
    return { gameStatus: gameStatus, dice: dice, damage: ['front', 0] }
  }
  activeSkill(status: boolean, team: 'red' | 'blue', index: number): [target, number] {
    this.buffs['hero'] = 2
    this.activeSkillUsed = true
    return ['front', 0]
  }
  finisher(status: boolean, team: 'red' | 'blue', index: number): [target, number] {
    if (status && team !== this.team) {
      switch (index) {
        case 0:
          return ['select1', 30]
        case 1:
          return ['select2', 30]
        case 2:
          return ['select3', 30]
      }
    }
    return ['front', 0]
  }
}
