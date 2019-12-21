import { useState } from 'react'

interface Config {
  stiffness?: number
  damping?: number
  mass?: number
}

const useMotion = (
  initialValue: number,
  { stiffness = 170, damping = 26, mass = 1 }: Config = {}
) => {
  const [value, setValue] = useState(initialValue)

  const set = (targetValue: number) => {
    const critical = 0.02

    let currentValue = value
    let currentTime = performance.now()
    let velocity = 0

    let raf: number

    const loop = () => {
      if (Math.abs(targetValue - currentValue) > critical) {
        const t = performance.now()
        const dt = (t - currentTime) / 1000
        currentTime = t

        const elasticForce = (targetValue - currentValue) * stiffness
        const friction = damping * velocity

        velocity += (dt * (elasticForce - friction)) / mass
        currentValue += velocity * dt
        raf = requestAnimationFrame(loop)
      } else {
        currentValue = targetValue
        cancelAnimationFrame(raf)
      }

      setValue(currentValue)
    }

    raf = requestAnimationFrame(loop)
  }

  return [value, set] as [number, React.Dispatch<React.SetStateAction<number>>]
}

export default useMotion
