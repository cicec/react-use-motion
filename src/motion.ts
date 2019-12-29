import Spring from './spring'
import { MotionConfig } from './types'

class Motion {
  private spring: Spring
  private time = 0
  private active = false
  private cb: (position: number) => void

  constructor(from: number, cb: (position: number) => void, config: MotionConfig) {
    this.spring = new Spring(from, config)
    this.cb = cb
  }

  private update() {
    if (!this.active) return

    const pt = this.time
    this.time = performance.now()
    const dt = (this.time - pt) / 1000

    const over = this.spring.move(dt)

    if (over) {
      this.active = false
    } else {
      requestAnimationFrame(() => this.update())
    }

    if (this.cb) this.cb(this.spring.position)
  }

  start(to: number) {
    this.spring.setTo(to)

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
