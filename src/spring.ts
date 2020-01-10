import { SpringConfig } from './types'

const DEFAULT_CONFIG = { tension: 170, friction: 26, mass: 1, precision: 0.01 }

export class Spring {
  private config = DEFAULT_CONFIG
  private velocities: number[]
  private to: number[]

  public positions: number[]

  constructor(from: number[], config: SpringConfig) {
    this.positions = from
    this.velocities = Array(from.length).fill(0)
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  setTo(to: number[]) {
    this.to = to
  }

  move(dt: number): boolean {
    const { tension, friction, mass, precision } = this.config

    return this.positions
      .map((position, i) => {
        const force = tension * (this.to[i] - position)
        const damping = -friction * this.velocities[i]

        this.velocities[i] += ((force + damping) / mass) * dt
        this.positions[i] += this.velocities[i] * dt

        if (
          Math.abs(this.to[i] - this.positions[i]) < precision &&
          Math.abs(this.velocities[i]) < precision
        ) {
          this.positions[i] = this.to[i]
          this.velocities[i] = 0
          return true
        }

        return false
      })
      .every(i => i)
  }
}
