import Spring from './spring'
import { is } from './helper'
import { Positions, MotionConfig, SpringConfig } from './types'

enum Types {
  Num = 'NUMBER',
  Arr = 'ARRAY',
  Obj = 'OBJECT',
  Dft = 'DEFAULT'
}

class Springs {
  private config: SpringConfig
  private springs: { [prop: string]: Spring } = {}
  private type: Types

  get positions(): Positions {
    if (this.type === Types.Num) {
      return this.springs[0].position
    } else if (this.type === Types.Arr) {
      return Object.keys(this.springs).map(prop => this.springs[prop].position)
    } else if (this.type === Types.Obj) {
      const ret: { [prop: string]: number } = {}

      for (const prop in this.springs) {
        ret[prop] = this.springs[prop].position
      }

      return ret
    } else {
      throw new Error('Type error!')
    }
  }

  constructor(from: Positions, config: MotionConfig) {
    this.config = config

    this.type = this.getType(from)

    if (this.type === Types.Num) {
      this.springs[0] = new Spring(from as number, this.config)
    } else if (this.type === Types.Arr) {
      from = from as number[]

      from.map((v, i) => (this.springs[i] = new Spring(v, this.config)))
    } else if (this.type === Types.Obj) {
      from = from as { [prop: string]: number }

      for (const prop in from) {
        this.springs[prop] = new Spring(from[prop], this.config)
      }
    }
  }

  getType(p: Positions): Types {
    if (is.num(p)) return Types.Num
    if (is.arr(p)) return Types.Arr
    if (is.obj(p)) return Types.Obj

    return Types.Dft
  }

  setTo(to: Positions) {
    if (this.type === Types.Num && is.num(to)) {
      this.springs[0].setTo(to as number)
    } else if (this.type === Types.Arr && is.arr(to)) {
      to = to as number[]

      to.map((v, i) => this.springs[i].setTo(v))
    } else if (this.type === Types.Obj && is.obj(to)) {
      for (const prop in to as { [prop: string]: number }) {
        to = to as { [prop: string]: number }

        this.springs[prop].setTo(to[prop])
      }
    } else {
      throw new Error('Type error!')
    }
  }

  move(dt: number): boolean {
    let over = true

    for (const prop in this.springs) {
      over = this.springs[prop].move(dt)
    }

    return over
  }
}

export default Springs
