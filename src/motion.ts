import { Action } from './action'
import { Values, MotionConfig } from './types'

class Motion<V extends Values> {
  private action: Action<V>
  private time = 0
  private active = false
  private cb: (position: Values) => void

  constructor(from: V, cb: (values: Values) => void, config: MotionConfig) {
    this.action = new Action<V>(from, config)
    this.cb = cb
  }

  private update() {
    if (!this.active) return

    const pt = this.time
    this.time = performance.now()
    const dt = (this.time - pt) / 1000

    const over = this.action.move(dt)

    if (over) {
      this.active = false
    } else {
      requestAnimationFrame(() => this.update())
    }

    if (this.cb) this.cb(this.action.toValues())
  }

  start(to: V) {
    this.action.setTo(to)

    if (!this.active) {
      this.active = true
      this.time = performance.now()
      requestAnimationFrame(() => this.update())
    }
  }

  stop() {
    if (this.active) this.active = false
  }
}

export default Motion
