import { SpringConfig } from './types'

const DEFAULT_CONFIG = { tension: 170, friction: 26, mass: 1, precision: 0.01 }

class Spring {
  private config = DEFAULT_CONFIG
  private velocity: number
  private to: number

  public position: number

  constructor(from: number, config: SpringConfig) {
    this.position = from
    this.velocity = 0
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  setTo(to: number) {
    this.to = to
  }

  move(dt: number): boolean {
    const { tension, friction, mass, precision } = this.config

    const force = tension * (this.to - this.position)
    const damping = -friction * this.velocity

    this.velocity += ((force + damping) / mass) * dt
    this.position += this.velocity * dt

    if (Math.abs(this.to - this.position) < precision && Math.abs(this.velocity) < precision) {
      this.position = this.to
      this.velocity = 0
      return true
    }

    return false
  }
}

export default Spring
