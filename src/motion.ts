import Springs from './springs'
import { Positions, MotionConfig } from './types'

class Motion {
  private springs: Springs
  private time = 0
  private active = false
  private cb: (position: Positions) => void

  constructor(from: Positions, cb: (position: Positions) => void, config: MotionConfig) {
    this.springs = new Springs(from, config)
    this.cb = cb
  }

  private update() {
    if (!this.active) return

    const pt = this.time
    this.time = performance.now()
    const dt = (this.time - pt) / 1000

    const over = this.springs.move(dt)

    if (over) {
      this.active = false
    } else {
      requestAnimationFrame(() => this.update())
    }

    if (this.cb) this.cb(this.springs.positions)
  }

  start(to: Positions) {
    this.springs.setTo(to)

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
