interface SpringConfig {
  tension?: number
  friction?: number
  mass?: number
  precision?: number
}

const DEFAULT_CONFIG = { tension: 170, friction: 26, mass: 1, precision: 0.01 }

class Spring {
  private config = DEFAULT_CONFIG
  private position = 0
  private velocity = 0
  private to = 0
  private time = 0
  private active = false
  private cb: (position: number) => void

  constructor(from: number, cb: (position: number) => void, config: SpringConfig = {}) {
    this.position = from
    this.cb = cb
    this.config = { ...this.config, ...config }
  }

  private update() {
    if (!this.active) return

    const pt = this.time
    this.time = performance.now()
    const dt = (this.time - pt) / 1000

    const { tension, friction, mass, precision } = this.config

    const force = tension * (this.to - this.position)
    const damping = -friction * this.velocity

    this.velocity += ((force + damping) / mass) * dt
    this.position += this.velocity * dt

    if (Math.abs(this.to - this.position) < precision && Math.abs(this.velocity) < precision) {
      this.position = this.to
      this.velocity = 0
      this.active = false
    } else {
      requestAnimationFrame(() => this.update())
    }

    if (this.cb) this.cb(this.position)
  }

  start(to: number) {
    this.to = to

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

export default Spring
export { Spring, SpringConfig }
