import { Spring } from './spring'
import { is } from './helper'
import { isColor, stringToRgba, rgbaToString } from './color'
import { Values, ValuesFor, SpringConfig } from './types'

type BaseTypes = 'NUMBER' | 'COLOR'
type State = ValuesFor<BaseState>

class BaseState {
  type: BaseTypes
  spring: Spring

  constructor(type: BaseTypes, spring: Spring) {
    this.type = type
    this.spring = spring
  }
}

const isObjVal = (v: Values): v is { [key: string]: number | string } => is.obj(v)
const isBasSta = (v: State): v is BaseState => v instanceof BaseState
const isObjSta = (v: State): v is { [key: string]: BaseState } => !isBasSta(v)

export class Action<V extends Values> {
  private state: State
  private config: SpringConfig

  private get springs() {
    if (isObjSta(this.state)) {
      return Object.values(this.state).map(v => v.spring)
    } else {
      return [this.state.spring]
    }
  }

  constructor(from: V, to: V, config: SpringConfig) {
    this.config = config
    this.initState(from)
    this.setTo(to)
  }

  private initState(values: V) {
    if (is.num(values) || is.str(values)) {
      const { type, positions } = this.handleBaseValues(values)
      this.state = new BaseState(type, new Spring(positions, this.config))
    } else if (isObjVal(values)) {
      this.state = {}

      for (const key in values) {
        const { type, positions } = this.handleBaseValues(values[key])
        this.state[key] = new BaseState(type, new Spring(positions, this.config))
      }
    } else {
      throw new Error('Params type error!')
    }
  }

  private handleBaseValues(values: number | string): { type: BaseTypes; positions: number[] } {
    if (is.num(values)) return { type: 'NUMBER', positions: [values] }

    if (is.str(values)) {
      if (isColor(values)) {
        return { type: 'COLOR', positions: stringToRgba(values) }
      } else {
        throw new Error('Unknown string format!')
      }
    }

    throw new Error('Params type error!')
  }

  private toBaseValues(state: BaseState): number | string {
    switch (state.type) {
      case 'NUMBER': {
        return state.spring.positions[0]
      }

      case 'COLOR': {
        return rgbaToString(state.spring.positions)
      }
    }
  }

  toValues(): V {
    if (isBasSta(this.state)) {
      return <V>this.toBaseValues(this.state)
    } else if (isObjSta(this.state)) {
      const ret: { [key: string]: number | string } = {}

      for (const key in this.state) {
        ret[key] = this.toBaseValues(this.state[key])
      }

      return <V>ret
    } else {
      throw new Error('State type error!')
    }
  }

  setTo(to: V) {
    if (isObjSta(this.state) && isObjVal(to)) {
      for (const key in this.state) {
        const { positions } = this.handleBaseValues(to[key])
        this.state[key].spring.setTo(positions)
      }
    } else if (isBasSta(this.state) && (is.num(to) || is.str(to))) {
      const { positions } = this.handleBaseValues(to)
      this.state.spring.setTo(positions)
    }
  }

  move(dt: number) {
    return this.springs.map(spring => spring.move(dt)).every(i => i)
  }

  reset() {
    this.springs.map(spring => spring.reset())
  }

  reverse() {
    this.springs.map(spring => spring.reverse())
  }

  stop() {
    this.springs.map(spring => spring.stop())
  }
}
