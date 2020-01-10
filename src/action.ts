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

  constructor(values: V, config: SpringConfig) {
    this.config = config
    this.initState(values)
  }

  public setTo(to: V) {
    if (isObjSta(this.state) && isObjVal(to)) {
      for (const key in this.state) {
        const { data } = this.handleBaseValues(to[key])
        this.state[key].spring.setTo(data)
      }
    } else if (isBasSta(this.state) && (is.num(to) || is.str(to))) {
      const { data } = this.handleBaseValues(to)
      this.state.spring.setTo(data)
    }
  }

  public move(dt: number) {
    if (isObjSta(this.state)) {
      let over = true

      for (const key in this.state) {
        over = this.state[key].spring.move(dt)
      }

      return over
    } else {
      return this.state.spring.move(dt)
    }
  }

  public toValues(): V {
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

  private initState(values: V) {
    if (is.num(values) || is.str(values)) {
      const { type, data } = this.handleBaseValues(values)
      this.state = new BaseState(type, new Spring(data, this.config))
    } else if (isObjVal(values)) {
      this.state = {}

      for (const key in values) {
        const { type, data } = this.handleBaseValues(values[key])
        this.state[key] = new BaseState(type, new Spring(data, this.config))
      }
    } else {
      throw new Error('Params type error!')
    }
  }

  private handleBaseValues(values: number | string): { type: BaseTypes; data: number[] } {
    if (is.num(values)) return { type: 'NUMBER', data: [values] }

    if (is.str(values)) {
      if (isColor(values)) {
        return { type: 'COLOR', data: stringToRgba(values) }
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
}
