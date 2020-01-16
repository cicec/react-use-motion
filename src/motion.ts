import { Action } from './action'
import { Values } from './types'

export class Motion<V extends Values> {
  private action: Action<V>
  private time = 0
  private active = false
  private cb: (position: Values) => void

  constructor(action: Action<V>, cb: (values: V) => void) {
    this.action = action
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

  to = (to: V, start = true) => {
    this.action.setTo(to)
    if (start) this.start()
  }

  start = () => {
    if (!this.active) {
      this.active = true
      this.time = performance.now()
      requestAnimationFrame(() => this.update())
    }
  }

  pause = () => {
    if (this.active) this.active = false
  }

  reset = () => {
    if (this.active) this.active = false
    this.action.reset()
    this.cb(this.action.toValues())
  }

  replay = () => {
    this.action.reset()
    this.cb(this.action.toValues())
    this.start()
  }

  stop = () => {
    if (this.active) this.active = false
    this.action.stop()
    this.cb(this.action.toValues())
  }
}
