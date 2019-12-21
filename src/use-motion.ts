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

  const getPrecision = (v: number) => Math.abs(v * 1e-5)

  const set = (targetValue: number) => {
    const precision = getPrecision(targetValue - value)

    let currentValue = value
    let currentTime = performance.now()
    let velocity = 0

    let raf: number

    const loop = () => {
      const distance = targetValue - currentValue

      if (Math.abs(distance) > precision) {
        const pt = currentTime
        currentTime = performance.now()
        const dt = (currentTime - pt) / 1000

        const fSpring = distance * stiffness
        const fDamper = damping * velocity

        velocity += (dt * (fSpring - fDamper)) / mass
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
