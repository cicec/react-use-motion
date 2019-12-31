import Spring from './spring'
import { is } from './helper'
import { MotionConfig, SpringConfig, Values } from './types'

type Types = 'NUMBER' | 'ARRAY' | 'OBJECT' | ''

class Springs {
  private config: SpringConfig
  private springs: { [prop: string]: Spring } = {}
  private type: Types

  get positions(): Values {
    if (this.type === 'NUMBER') {
      return this.springs[0].position
    } else if (this.type === 'ARRAY') {
      return Object.keys(this.springs).map(prop => this.springs[prop].position)
    } else if (this.type === 'OBJECT') {
      const ret: { [prop: string]: number } = {}

      for (const prop in this.springs) {
        ret[prop] = this.springs[prop].position
      }

      return ret
    } else {
      throw new Error('Type error!')
    }
  }

  constructor(from: Values, config: MotionConfig) {
    this.config = config

    if (is.num(from)) {
      this.springs[0] = new Spring(from as number, this.config)
      this.type = 'NUMBER'
    } else if (is.arr(from)) {
      from.map((v, i) => (this.springs[i] = new Spring(v, this.config)))
      this.type = 'ARRAY'
    } else if (is.obj(from)) {
      from = from as { [prop: string]: number }

      for (const prop in from) {
        this.springs[prop] = new Spring(from[prop], this.config)
      }
      this.type = 'OBJECT'
    }
  }

  setTo(to: Values) {
    if (this.type === 'NUMBER' && is.num(to)) {
      this.springs[0].setTo(to as number)
    } else if (this.type === 'ARRAY' && is.arr(to)) {
      to.map((v, i) => this.springs[i].setTo(v))
    } else if (this.type === 'OBJECT' && is.obj(to)) {
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
