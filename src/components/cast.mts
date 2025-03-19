export type target = 'front' | 'all' | 'select1' | 'select2' | 'select3'
export type damageType = 'Normal' | 'PassiveSkill' | 'ActiveSkill' | 'Finisher'
export type gameStatus =
  | 'select'
  | 'jankenBefore'
  | 'jankenDraw'
  | 'diceBefore'
  | 'damageBefore'
  | 'damageAfter'
  | 'finishBefore'
  | 'finishAfter'
export type castClass = cast | cast_P | cast_B

export default function returnCast(id: string): cast | cast_P | cast_B {
  switch (id) {
    case 'P':
      return new cast_P()
    case 'B':
      return new cast_B()
    default:
      return new cast()
  }
}

export class cast {
  id = 'undefined'
  maxHp = 20
  hp: number
  skillAbleGameStatus = ['diceBefore']
  finisherAbleGameStatus = ['diceBefore']
  constructor() {
    this.hp = this.maxHp
  }
  returnImgUri(): string {
    return `./castImages/${this.id}.png`
  }
  normalyAttack(dice: number): [target, number] {
    return ['front', dice]
  }
  damaged(damage: number, fromPerty: boolean, damageType: damageType): void {
    this.hp -= damage
  }
  healed(point: number, fromPerty: boolean, healType: damageType): void {
    this.hp += point
  }
  skillCheck(
    gameStatus: 'select' | 'jankenBefore' | 'jankenDraw' | 'diceBefore' | 'diceAfter',
  ): void {
    return
  }
}

export class cast_P extends cast {
  id = 'P'
  maxHp = 20
  constructor() {
    super()
    this.hp = this.maxHp
  }
}
export class cast_B extends cast {
  id = 'B'
  maxHp = 20
  constructor() {
    super()
    this.hp = this.maxHp
  }
}
